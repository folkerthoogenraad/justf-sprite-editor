import { Component, inject } from '@angular/core';
import { Button } from "../../components/button/button";
import { EditorStateService } from '../editor-state-service';

@Component({
  selector: 'app-navbar',
  imports: [Button],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  state = inject(EditorStateService)
}
