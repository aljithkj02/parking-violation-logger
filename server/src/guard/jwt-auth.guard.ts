import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }

    canActivate(context: any) {
        // Add custom logic here, e.g., checking for roles, etc.
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        // Attach user to request
        context.switchToHttp().getRequest().user = user;
        return user;
    }
}
