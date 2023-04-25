import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from "@angular/core";

@Directive({
    selector: '[appHighlight]',
})

export class HighlightDirective implements OnChanges {
    @Input() inputValue: string | undefined;
    @Input() phoneValue: string | undefined;

    constructor(private elementRef: ElementRef, private readonly renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.phoneValue) {
            return;
        }
      
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', this.getText());
    }

    getText(): string {
        const reg = new RegExp(this.inputValue ?? '', 'i');

        return this.phoneValue?.replace(reg, `<span class="highlighted">$&</span>`) ?? '';
    }
}