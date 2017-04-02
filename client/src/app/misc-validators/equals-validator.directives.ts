import {Attribute, Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

/**
 * use reserve, to set the error on the EqualsTo element and not on the checked element it self.
 */
@Directive({
  selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidatorDirective), multi: true}]
})
export class EqualValidatorDirective implements Validator {
  constructor(@Attribute('validateEqual') public validateEqual: string,
              @Attribute('reverse') public reverse: string) {
  }

  private get isReverse() {
    if (!this.reverse) {
      return false;
    }
    return this.reverse === 'true';
  }

  validate(currentControl: AbstractControl): { [key: string]: any } {
    const currentControlValue = currentControl.value;
    const equalsToControl = currentControl.parent.get(this.validateEqual);

    if (equalsToControl && currentControlValue !== equalsToControl.value && !this.isReverse) {
      return {
        validateEqual: false
      };
    }

    // value equal and reverse
    if (equalsToControl && currentControlValue === equalsToControl.value && this.isReverse) {
      delete equalsToControl.errors['validateEqual'];
      if (!Object.keys(equalsToControl.errors).length) {
        equalsToControl.setErrors(null);
      }
    }

    // value not equal and reverse
    if (equalsToControl && currentControlValue !== equalsToControl.value && this.isReverse) {
      equalsToControl.setErrors({
        validateEqual: false
      });
    }
    return null;
  }
}
