import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    async signup(signupDto: SignupDto) {
        const { name, email, password, role } = signupDto;

        // Check if user already exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new this.userModel({
                name,
                email,
                password: hashedPassword,
                role,
            });

            const savedUser = await newUser.save();

            // Sign JWT token with user ID
            const token = await this.jwtService.signAsync({ id: savedUser._id });

            // Return token and user info (excluding password)
            return {
                message: 'Signup successful',
                token,
                user: {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    role: savedUser.role,
                },
            };
        } catch (error) {
            console.error('Signup error:', error);
            throw new InternalServerErrorException('Failed to create user');
        }
    }


    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        try {
            // Check if user exists
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Sign JWT token with user ID
            const token = await this.jwtService.signAsync({ id: user._id });

            // Return token and user info (excluding password)
            return {
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            };
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Login failed');
        }
    }
}
