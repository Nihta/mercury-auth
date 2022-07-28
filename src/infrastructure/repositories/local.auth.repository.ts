import { Inject, Injectable } from '@nestjs/common'
import _ from 'lodash/fp'
import { asyncScheduler, map, Observable, scheduled } from 'rxjs'
import {
  AUTH_PASSWORD_HASHER,
  AuthRepository,
  IAuthUserEntity,
  PasswordHasherService,
} from '../../domain'

@Injectable()
export class LocalAuthRepository implements AuthRepository {
  public constructor(
    @Inject(AUTH_PASSWORD_HASHER)
    protected readonly hasher: PasswordHasherService
  ) {}

  public getAuthUserByUsername(
    username: string
  ): Observable<IAuthUserEntity | undefined> {
    return scheduled(this.hasher.hash('testLogin@12345'), asyncScheduler).pipe(
      map((password: string) => ({
        id: _.random(1, 1999).toString(),
        username: 'duypt.dev@gmail.com',
        email: 'duypt.dev@gmail.com',
        password,
      })),
      map((user) => {
        if (username !== user.username) {
          return undefined
        }

        return user
      })
    )
  }
}
