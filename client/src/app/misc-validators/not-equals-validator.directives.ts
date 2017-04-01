import {Attribute, Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

/**
 * use reserve, to set the error on the NotEqualsTo element and not on the checked element it self.
 */
@Directive({
  selector: '[validateNotEqual][formControlName],[validateNotEqual][formControl],[validateNotEqual][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => NotEqualValidator), multi: true}]
})
export class NotEqualValidator implements Validator {
  constructor(@Attribute('validateNotEqual') public validateNotEqual: string,
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
    const notEqualsToControl = currentControl.parent.get(this.validateNotEqual);

    if (notEqualsToControl && currentControlValue === notEqualsToControl.value && !this.isReverse) {
      return {
        validateNotEqual: false
      };
    }

    if (notEqualsToControl && currentControlValue !== notEqualsToControl.value && this.isReverse) {
      // value equal and reverse
      delete notEqualsToControl.errors['validateNotEqual'];
      if (!Object.keys(notEqualsToControl.errors).length) {
        notEqualsToControl.setErrors(null);
      }
    }

    // value not equal and reverse
    if (notEqualsToControl && currentControlValue === notEqualsToControl.value && this.isReverse) {
      notEqualsToControl.setErrors({
        validateNotEqual: false
      });
    }
    return null;
  }
}
