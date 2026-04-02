import { singleton } from 'tsyringe';

@singleton()
export class SessionInfo {
  private _currentUserId: number | null = null;
  private _isAdmin: boolean = false;

  set currentUserId(value: number) {
    this._currentUserId = value;
  }

  get currentUserId(): number | null {
    return this._currentUserId;
  }

  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }

  get isAdmin() {
    return this._isAdmin;
  }

  clear(): void {
    this._currentUserId = null;
    this._isAdmin = false;
  }

  isLoggedIn(): boolean {
    return this._currentUserId !== null;
  }
}
