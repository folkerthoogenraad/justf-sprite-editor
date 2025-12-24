import { AfterViewInit, Component, computed, ElementRef, HostListener, inject, viewChild } from '@angular/core';
import { ViewportService } from '../viewport-service';
import { Vector2 } from '../../../ts/utils/Vector2';
import { Sprite, SpriteFrame } from '../../../ts/Sprite';
import { EditorStateService } from '../editor-state-service';

@Component({
  selector: 'app-sprite-canvas',
  imports: [],
  templateUrl: './sprite-canvas.html',
  styleUrl: './sprite-canvas.scss',
  host: { style: "overflow: hidden;" }
})
export class SpriteCanvas implements AfterViewInit {
  element = viewChild<ElementRef>("viewport");

  viewport = inject(ViewportService);
  state = inject(EditorStateService);

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

    this.viewport.element.set(element); // Is this safe? good idea? Bad idea? No idea!
    this.viewport.windowWidth.set(element.offsetWidth);
    this.viewport.windowHeight.set(element.offsetHeight);
  }

  // ==================================================================== //
  // Pan, zoom, create, etc
  // ==================================================================== //
  previousMouseX: number = 0;
  previousMouseY: number = 0;
  mouseDeltaX: number = 0;
  mouseDeltaY: number = 0;
  mouseX: number = 0;
  mouseY: number = 0;

  newSpriteStart: Vector2 = new Vector2();

  newSpritePointerId: number = -1;

  panPointerId: number = -1;

  onPointerDown(evt: PointerEvent) {
    this.defaultPointerEvent(evt);

    // Create new sprite!
    if(evt.button === 0) {
      if(this.newSpritePointerId > 0) return;

      this.newSpritePointerId = evt.pointerId;

      let x = this.viewport.toViewportX(this.mouseX);
      let y = this.viewport.toViewportY(this.mouseY);

      this.newSpriteStart.apply(x, y);

      this.capturePointer(evt);
    }
    
    // Panning
    else {
      if(this.panPointerId > 0) return;
      
      this.panPointerId = evt.pointerId;

      this.capturePointer(evt);
    }
  }
  onPointerUp(evt: PointerEvent) {
    this.defaultPointerEvent(evt);

    // Create new sprite!!
    if(this.newSpritePointerId === evt.pointerId) {
      this.newSpritePointerId = -1;

      const texture = this.state.texture()?.fileName;
      const resources = this.state.resources();

      if(!texture) return;
      if(!resources) return;

      let startX = Math.round(this.newSpriteStart.x);
      let startY = Math.round(this.newSpriteStart.y);

      let endX = Math.round(this.viewport.toViewportX(this.mouseX));
      let endY = Math.round(this.viewport.toViewportY(this.mouseY));
      
      let width = endX - startX;
      let height = endY - startY;

      if(width < 1 || height < 1) {
        return;
      }

      let frame = new SpriteFrame(startX, startY, width, height, 0, 0);

      let sprite = new Sprite(resources.getFirstAvailableId("sprite.0"), texture, 8, [frame]);

      this.state.addSprite(sprite);
    }

    // Stop panning
    else if(this.panPointerId === evt.pointerId) {
      this.panPointerId = -1;
    }
  }
  onPointerMove(evt: PointerEvent) {
    this.defaultPointerEvent(evt);

    // Do some panning
    if(this.panPointerId == evt.pointerId) {
      this.viewport.pan(
        -this.viewport.toViewportScale(this.mouseDeltaX), 
        -this.viewport.toViewportScale(this.mouseDeltaY),
      );
    }

  }
  onMouseWheel(evt: WheelEvent) {
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
  
  private defaultPointerEvent(evt: MouseEvent) {
    let element = this.element()?.nativeElement;

    if(!element) return;

    this.previousMouseX = this.mouseX;
    this.previousMouseY = this.mouseY;

    this.mouseX = evt.clientX - element.offsetLeft;
    this.mouseY = evt.clientY - element.offsetTop;

    this.mouseDeltaX = this.mouseX - this.previousMouseX;
    this.mouseDeltaY = this.mouseY - this.previousMouseY;
  }

  private capturePointer(evt: PointerEvent) {
    let element = this.element()?.nativeElement as HTMLElement;

    if(!element) return;

    element.setPointerCapture(evt.pointerId);
  }
}
