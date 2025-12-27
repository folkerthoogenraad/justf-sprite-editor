import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { UndoStack } from './ts/utils/UndoStack';

(window as any).UndoStack = UndoStack;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
