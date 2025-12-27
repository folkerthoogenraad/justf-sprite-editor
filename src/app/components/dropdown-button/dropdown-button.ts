import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';

@Component({
  selector: 'c-dropdown-button',
  imports: [],
  templateUrl: './dropdown-button.html',
  styleUrl: './dropdown-button.scss',
})
export class DropdownButton {
  openButtonElement = viewChild<ElementRef<HTMLElement>>("openButton");
  open = signal(false);

  toggle() {
    this.open.update(x => !x);
  }

  @HostListener("window:click", ['$event']) 
  close(evt: MouseEvent) {
    const element = this.openButtonElement()?.nativeElement;

    if(!element) return;

    if(element === evt.target || element.contains(evt.target as HTMLElement)) return;

    this.open.set(false);
  }
}
