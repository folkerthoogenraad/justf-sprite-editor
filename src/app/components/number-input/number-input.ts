import { Component, effect, ElementRef, input, model, signal, untracked, viewChild } from '@angular/core';
import { TextInput } from "../text-input/text-input";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";

export type NumberType = "Integer" | "Float";

const integerRegex = new RegExp(/^-?\d+$/);
const floatRegex = new RegExp(/^-?\d*(\.\d+)?$/);

@Component({
  selector: 'c-number-input',
  imports: [TextInput, Button, Icon],
  templateUrl: './number-input.html',
  styleUrl: './number-input.scss',
})
export class NumberInput {
  textInputElement = viewChild<TextInput>("input");
  value = model(0);

  valueInternal = signal("0");
  valid = signal(true);

  type = input<NumberType>("Integer");
  buttons = input(true);
  
  constructor() {
    effect(() => {
      const value = this.value();

      untracked(() => {
        this.resetInternalValue();
      });
    });

    effect(() => {
      const stringValue = this.valueInternal();

      untracked(() => {
        this.updateValidation(stringValue);
      });
    });
  }

  add() {
    const value = this.value();

    this.value.set(value + 1);

    this.resetInternalValue();
  }
  
  remove() {
    const value = this.value();

    this.value.set(value - 1);

    this.resetInternalValue();
  }

  resetInternalValue() {
    const value = this.value();
    
    this.valueInternal.set(value.toString());
    this.valid.set(true);
  }

  updateValidation(v: string) {
    const value = this.tryParse(v);

    if(value === undefined) {
      this.valid.set(false);
      return;
    }
    
    this.valid.set(true);
  }

  commit() {
    const v = this.valueInternal();
    const value = this.tryParse(v);

    this.resetInternalValue();

    if(value === undefined) {
      return;
    }

    this.value.set(value);
  }

  tryParse(v: string): number | undefined {
    const type = this.type();

    if(type === "Integer") {
      if(integerRegex.test(v)){
        return parseInt(v);
      }
    }
    if(type === "Float") {
      if(floatRegex.test(v)){
        return parseFloat(v);
      }
    }

    return undefined;
  }

  dragPointerId: number = -1;
  dragPointerStartY: number = 0;
  dragPointerEndY: number = 0;

  onPointerDown(evt: PointerEvent) {
    if(this.dragPointerId > 0) return;
    if(this.textInputElement()?.focussed() ?? false) {
      return;
    }

    evt.preventDefault(); // TODO: Don't actually, or at least provide an alternative?

    this.dragPointerId = evt.pointerId;
    this.dragPointerStartY = evt.offsetY;
    this.dragPointerEndY = evt.offsetY;

    (evt.target as HTMLElement).setPointerCapture(evt.pointerId);
  }
  onPointerMove(evt: PointerEvent) {
    if(this.dragPointerId !== evt.pointerId) return;
    evt.preventDefault(); // TODO: Don't actually, or at least provide an alternative?

    this.dragPointerEndY = evt.offsetY;

    this.updateDragPreviewValue();
  }
  onPointerUp(evt: PointerEvent) {
    if(this.dragPointerId !== evt.pointerId) return;
    evt.preventDefault(); // TODO: Don't actually, or at least provide an alternative?

    this.dragPointerId = -1;

    if(this.dragPointerEndY === this.dragPointerStartY) {
      this.textInputElement()?.focus(); // Call focus!
      // Select the text, somehow??
      return;
    }

    this.dragPointerEndY = evt.offsetY;

    this.updateDragPreviewValue();

    this.commit();

  }

  updateDragPreviewValue() {
    let value = this.value();

    value += Math.round((this.dragPointerStartY - this.dragPointerEndY) / 16);

    this.valueInternal.set(value.toString());
  }
}
