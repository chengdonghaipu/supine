import {TemplateRef} from '@angular/core';

export interface GroupModel {
  addOnBeforeIcon: string | null;
  addOnAfterIcon: string | null;
  prefixIcon: string | null;
  suffixIcon: string | null;
  addOnBefore: string | TemplateRef<void>;
  addOnAfter: string | TemplateRef<void>;
  prefix: string | TemplateRef<void>;
  suffix: string | TemplateRef<void>;
}
