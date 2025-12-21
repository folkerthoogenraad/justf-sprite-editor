import { AfterViewInit, Component, computed, ElementRef, HostListener, inject, viewChild } from '@angular/core';
import { SpriteViewService } from '../sprite-view-service';

@Component({
  selector: 'app-sprite-view',
  imports: [],
  templateUrl: './sprite-view.html',
  styleUrl: './sprite-view.scss',
  host: { style: "overflow: hidden;" }
})
export class SpriteView implements AfterViewInit {
  element = viewChild<ElementRef>("viewport");

  viewport = inject(SpriteViewService);

  backgroundStyles = computed(() => {
    return {
      'background-position': `${-this.viewport.viewportLeft() * this.viewport.zoomLevel()}px ${-this.viewport.viewportTop() * this.viewport.zoomLevel()}px`,
      'background-size': `${this.viewport.zoomLevel() * 64}px ${this.viewport.zoomLevel() * 64}px`,
    };
  });
  
  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener("window:resize")
  onResize() {
    let element = this.element()?.nativeElement;
    
    if(element === undefined) return;

    this.viewport.windowWidth.set(element.offsetWidth);
    this.viewport.windowHeight.set(element.offsetHeight);
  }

  previousMouseX: number = 0;
  previousMouseY: number = 0;
  mouseDeltaX: number = 0;
  mouseDeltaY: number = 0;
  mouseX: number = 0;
  mouseY: number = 0;

  draggingPointer: number = -1;

  onPointerDown(evt: PointerEvent) {
    this.defaultMouseEvent(evt);
    
    if(this.draggingPointer > 0) return;
    
    this.draggingPointer = evt.pointerId;
  }
  onPointerUp(evt: PointerEvent) {
    this.defaultMouseEvent(evt);

    if(this.draggingPointer -= evt.pointerId) {
      this.draggingPointer = -1;
    }
  }
  onPointerMove(evt: PointerEvent) {
    this.defaultMouseEvent(evt);

    if(this.draggingPointer !== evt.pointerId) return;

    this.viewport.pan(
      -this.viewport.toViewportScale(this.mouseDeltaX), 
      -this.viewport.toViewportScale(this.mouseDeltaY),
    );
  }
  wheel(evt: WheelEvent) {
    let s = evt.deltaY;

    let x = this.viewport.toViewportX(this.mouseX);
    let y = this.viewport.toViewportY(this.mouseY);

    if(s > 0) {
      this.viewport.zoomTo(x, y, 0.8);
    }
    else{
      this.viewport.zoomTo(x, y, 1 / 0.8);
    }
  }
  keyDown(evt: KeyboardEvent){
    // if(evt.key == "ArrowLeft") {
    //   this.viewport.pan(-16, 0);
    // }
    // if(evt.key == "ArrowRight") {
    //   this.viewport.pan(16, 0);
    // }
    // if(evt.key == "ArrowUp") {
    //   this.viewport.pan(0, -16);
    // }
    // if(evt.key == "ArrowDown") {
    //   this.viewport.pan(0, 16);
    // }
  }

  private defaultMouseEvent(evt: MouseEvent) {
    let element = this.element()?.nativeElement;

    if(!element) return;

    this.previousMouseX = this.mouseX;
    this.previousMouseY = this.mouseY;

    this.mouseX = evt.clientX - element.offsetLeft;
    this.mouseY = evt.clientY - element.offsetTop;

    this.mouseDeltaX = this.mouseX - this.previousMouseX;
    this.mouseDeltaY = this.mouseY - this.previousMouseY;
  }
}
