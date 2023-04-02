import { Component, ElementRef, HostListener, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  private track: HTMLElement | null = null;
  private dragging = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.track = this.el.nativeElement.querySelector('#image-track');

    if (this.track) {
      this.track.style.transform = 'translate(0%, -50%)';
      this.track.dataset['percentage'] = '0';
      this.track.dataset['prevPercentage'] = '0';

      const images = this.track.getElementsByClassName('image');
      for (const image of Array.from(images)) {
        (image as HTMLElement).style.objectPosition = '100% center';
      }
    }
  }

  ngOnDestroy(): void {
    this.track = null;
  }

  onImageClick(event: MouseEvent): void {
    const targetUrl = (event.currentTarget as HTMLImageElement).getAttribute('data-url');
    if (targetUrl && !this.dragging) {
      window.location.href = targetUrl;
    }
  }
  
  
  
  

  @HostListener('window:mousedown', ['$event'])
  @HostListener('window:touchstart', ['$event.touches[0]'])
  handleOnDown(e: MouseEvent | Touch): void {
    if (this.track) {
      this.track.dataset['mouseDownAt'] = e.clientX.toString();
    }
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  handleOnUp(): void {
    if (this.track) {
      this.track.dataset['mouseDownAt'] = '0';
      this.track.dataset['prevPercentage'] = this.track.dataset['percentage'] || '0';
    }

    setTimeout(() => {
      this.dragging = false;
    }, 100);
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event.touches[0]'])
  handleOnMove(e: MouseEvent | Touch): void {
    if (this.track && this.track.dataset['mouseDownAt'] !== '0') {
      this.dragging = true;
      const mouseDelta = parseFloat(this.track.dataset['mouseDownAt'] || '0') - e.clientX;
      const maxDelta = window.innerWidth / 2;

      const percentage = (mouseDelta / maxDelta) * -100;
      const nextPercentageUnconstrained = parseFloat(this.track.dataset['prevPercentage'] || '0') + percentage;
      const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

      if (this.track) {
        this.track.dataset['percentage'] = nextPercentage.toString();

        this.track.animate(
          {
            transform: `translate(${nextPercentage}%, -50%)`,
          },
          { duration: 1200, fill: 'forwards' },
        );

        const images = this.track.getElementsByClassName('image');
        for (const image of Array.from(images)) {
          (image as HTMLElement).animate(
            {
              objectPosition: `${100 + nextPercentage}% center`,
            },
            { duration: 1200, fill: 'forwards' },
          );
        }
      }
    }
  }
}
