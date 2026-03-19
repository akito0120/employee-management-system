import { singleton } from 'tsyringe';

@singleton()
export class SessionInfo {
  private _currentUserId: number | null = null;

  set currentUserId(value: number) {
    this._currentUserId = value;
  }

  get currentUserId(): number | null {
    return this._currentUserId;
  }

  clear(): void {
    this._currentUserId = null;
  }

  isLoggedIn(): boolean {
    return this._currentUserId !== null;
  }
}
