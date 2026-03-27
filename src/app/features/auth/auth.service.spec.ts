import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // intercepts real HTTP and lets us mock responses
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start logged out', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should login with correct credentials', () => {
    service.login('admin', 'admin').subscribe((response) => {
      expect(response.accessToken).toBeTruthy();
      expect(service.isLoggedIn()).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'admin', password: 'admin' });
    req.flush({
      accessToken: 'fake-access-token-123',
      refreshToken: 'fake-refresh-token-123',
    });
  });

  it('should remain logged out on wrong credentials', () => {
    service.login('admin', 'wrong').subscribe({
      next: () => {
        throw new Error('should have failed');
      },
      error: () => {
        expect(service.isLoggedIn()).toBe(false);
      },
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should store refresh token in localStorage on login', () => {
    service.login('admin', 'admin').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    req.flush({
      accessToken: 'fake-access-token-123',
      refreshToken: 'fake-refresh-token-123',
    });

    expect(localStorage.getItem('refreshToken')).toBe('fake-refresh-token-123');
  });

  it('should logout and reset state', () => {
    service.login('admin', 'admin').subscribe();
    const loginReq = httpMock.expectOne('http://localhost:3000/auth/login');
    loginReq.flush({
      accessToken: 'fake-access-token-123',
      refreshToken: 'fake-refresh-token-123',
    });

    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    // Handle the logout HTTP call
    const logoutReq = httpMock.expectOne('http://localhost:3000/auth/logout');
    logoutReq.flush({ message: 'Logged out' });

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('should refresh access token successfully', () => {
    localStorage.setItem('refreshToken', 'fake-refresh-token-123');

    service.refreshAccessToken().subscribe((response) => {
      expect(response.accessToken).toBeTruthy();
      expect(service.isLoggedIn()).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/refresh');
    expect(req.request.method).toBe('POST');
    req.flush({ accessToken: 'new-fake-access-token-456' });
  });

  it('should set isRefreshing to false after refresh completes', () => {
    localStorage.setItem('refreshToken', 'fake-refresh-token-123');

    service.refreshAccessToken().subscribe();

    expect(service.isRefreshing).toBe(true);

    const req = httpMock.expectOne('http://localhost:3000/auth/refresh');
    req.flush({ accessToken: 'new-fake-access-token-456' });

    expect(service.isRefreshing).toBe(false);
  });
});
