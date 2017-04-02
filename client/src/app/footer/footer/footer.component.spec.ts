import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FooterComponent} from './footer.component';
import {AuthenticationService} from '../../remote/authentication.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    const authServiceSpy = jasmine.createSpyObj<AuthenticationService>('AuthService', ['getLoggedInUsername']);

    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        {provide: AuthenticationService, useValue: authServiceSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {


    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
