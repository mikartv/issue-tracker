import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: { open: jest.Mock };

  beforeEach(() => {
    snackBarSpy = { open: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('success() calls MatSnackBar.open with snack-success panelClass', () => {
    service.success('Issue saved');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Issue saved',
      'Dismiss',
      expect.objectContaining({ panelClass: ['snack-success'] }),
    );
  });

  it('error() calls MatSnackBar.open with snack-error panelClass', () => {
    service.error('Failed to save issue');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to save issue',
      'Dismiss',
      expect.objectContaining({ panelClass: ['snack-error'] }),
    );
  });

  it('info() calls MatSnackBar.open without custom panelClass', () => {
    service.info('Loading...');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Loading...',
      'Dismiss',
      expect.objectContaining({ duration: 4000 }),
    );
  });

  it('success() uses default duration 4000ms when not specified', () => {
    service.success('Done');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Done',
      'Dismiss',
      expect.objectContaining({ duration: 4000 }),
    );
  });

  it('error() uses custom duration when specified', () => {
    service.error('Something went wrong', 6000);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Something went wrong',
      'Dismiss',
      expect.objectContaining({ duration: 6000 }),
    );
  });
});
