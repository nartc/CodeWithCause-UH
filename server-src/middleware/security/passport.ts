import * as _passport from 'passport';
import {PassportStatic} from 'passport';
import {UserRepository} from '../../repositories/UserRepository';
import {IUser, User} from '../../models/User';
import {IUserRepository} from '../../repositories/IUserRepository';
import {ExtractJwt, Strategy, StrategyOptions, VerifiedCallback} from 'passport-jwt';
import {get} from 'config';
import {MongoError} from 'mongodb';

export const authenticateUser = (passport: PassportStatic) => {
    const _userRepository: IUserRepository = new UserRepository(User);

    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.JWT_SECRET || get('auth.jwt-secret')
    };

    passport.use(new Strategy(options, async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
        const result = await _userRepository.getResourceById(jwtPayload.user._id);

        if (result instanceof MongoError) return done(result, false);
        if (!result) {
            return done(null, false);
        } else {
            return done(null, result, {issuedAt: jwtPayload.iat});
        }
    }));
};

export function expressAuthentication(strategy: string) {
    return _passport.authenticate(strategy.toLowerCase(), {session: false});
}

interface IJwtPayload {
    user?: IUser;
    iat?: Date;
}