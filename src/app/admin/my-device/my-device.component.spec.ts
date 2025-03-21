import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDeviceComponent } from './my-device.component';

describe('MyDeviceComponent', () => {
  let component: MyDeviceComponent;
  let fixture: ComponentFixture<MyDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
