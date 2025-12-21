import { computed, Injectable, isSignal, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpriteViewService {
  zoomLevel = signal(1);

  viewportLeft = signal(0);
  viewportTop = signal(0);
  viewportWidth = computed(() => this.windowWidth() / this.zoomLevel());
  viewportHeight = computed(() => this.windowHeight() / this.zoomLevel());

  windowWidth = signal(1);
  windowHeight = signal(1);

  zoomTo(x: number, y: number, amount: number) {
    // Relative position of the zoom point
    let rx = (x - this.viewportLeft()) / this.viewportWidth();
    let ry = (y - this.viewportTop()) / this.viewportHeight();

    this.setZoom(this.zoomLevel() * amount);
    
    // The new relative position of the zoom point
    let rax = (x - this.viewportLeft()) / this.viewportWidth();
    let ray = (y - this.viewportTop()) / this.viewportHeight();

    // The relative delta
    let rdx = rax - rx;
    let rdy = ray - ry;

    // Adjust the viewport panning by the relative amount
    this.pan(rdx * this.viewportWidth(), rdy * this.viewportHeight());
  }
  zoomToFitHeight(height: number) {
    let windowHeight = this.windowHeight();
  
    this.setZoom(windowHeight / height);
  }
  zoomToFitWidth(width: number) {
    let windowWidth = this.windowWidth();
  
    this.setZoom(windowWidth / width);
  }
  zoomToFit(width: number, height: number) {
    let windowWidth = this.windowWidth();
    let windowHeight = this.windowHeight();

    let zoom = Math.min(windowWidth / width, windowHeight / height);
  
    this.setZoom(zoom);
  }

  setZoom(z: number){
    if(z < 0.25) { z = 0.25; }
    if(z > 100) { z = 100; }

    this.zoomLevel.set(z);
  }

  panToCenter(x: number, y: number){
    let width = this.viewportWidth();
    let height = this.viewportHeight();
  
    this.viewportLeft.set(x - width / 2);
    this.viewportTop.set(y - height / 2);
  }
  pan(deltaX: number, deltaY: number) {
    this.viewportLeft.update(x => x + deltaX);
    this.viewportTop.update(y => y + deltaY);
  }

  toPixelScale(n: number){ 
    return n * this.zoomLevel();
  }

  toViewportScale(n: number) {
    return n / this.zoomLevel();
  }
  toViewportX(windowX: number) {
    return this.viewportLeft() + windowX / this.zoomLevel();
  }
  toViewportY(windowY: number) {
    return this.viewportTop() + windowY / this.zoomLevel();
  }

  computedStyle(x: Signal<number> | number, y: Signal<number> | number) {
    return computed(() => {
      let xx = isSignal(x) ? x() : x;
      let yy = isSignal(y) ? y() : y;

      return {
        'position': 'absolute',
        'transform-origin': 'top left',
        'transform': `translate(${xx * this.zoomLevel() - this.viewportLeft() * this.zoomLevel() }px, ${yy * this.zoomLevel() - this.viewportTop()  * this.zoomLevel() }px) scale(${this.zoomLevel()})`,
      };
    });
  }
  computedTransform(x: Signal<number> | number, y: Signal<number> | number) {
    return computed(() => {
      let xx = isSignal(x) ? x() : x;
      let yy = isSignal(y) ? y() : y;

      return `translate(${xx * this.zoomLevel() - this.viewportLeft() * this.zoomLevel() }px, ${yy * this.zoomLevel() - this.viewportTop()  * this.zoomLevel() }px) scale(${this.zoomLevel()})`;
    });
  }
  computedLeft(x: Signal<number> | number) {
    return computed(() => {
      let xx = isSignal(x) ? x() : x;

      return xx * this.zoomLevel() - this.viewportLeft() * this.zoomLevel();
    });
  }
  computedTop(y: Signal<number> | number) {
    return computed(() => {
      let yy = isSignal(y) ? y() : y;

      return yy * this.zoomLevel() - this.viewportTop()  * this.zoomLevel();
    });
  }
  computedSize(size: Signal<number> | number) {
    return computed(() => {
      let s = isSignal(size) ? size() : size;

      return s * this.zoomLevel();
    });
  }
}
