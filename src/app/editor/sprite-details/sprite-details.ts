import { Component, input, output } from '@angular/core';
import { Sprite } from '../../../ts/Sprite';

@Component({
  selector: 'app-sprite-details',
  imports: [],
  templateUrl: './sprite-details.html',
  styleUrl: './sprite-details.scss',
})
export class SpriteDetails {
  sprite = input<Sprite>();
  spriteChange = output<Sprite>();

  
}
