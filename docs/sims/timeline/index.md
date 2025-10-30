---
hide:
  toc
---
# FFT History Timeline

<iframe src="main.html" height="500"></iframe>
[Open in full window](main.html){ .md-button }

This interactive timeline visualization shows the 50 most important advances in Fast Fourier Transform (FFT) technology, from theoretical foundations to modern hardware implementations.

## Timeline Coverage

The timeline spans from **1805 to 2024** and includes:

### 1. **FFT Algorithms** (Orange)
- Gauss's original discovery (1805)
- Cooley-Tukey algorithm (1965)
- Radix-4, Split-radix, Winograd, and other algorithmic innovations
- Modern sparse FFT algorithms

### 2. **Software Libraries** (Light Blue)
- FFTW (Fastest Fourier Transform in the West)
- CMSIS-DSP (ARM's standard library)
- Intel MKL and IPP
- NVIDIA cuFFT for GPU acceleration
- KISS FFT

### 3. **DSP Chips** (Green)
- Texas Instruments TMS320 family evolution
- Motorola DSP56000 series
- Analog Devices SHARC and Blackfin
- Dedicated DSP processors that revolutionized signal processing

### 4. **Microcontrollers** (Pink)
- ARM Cortex-M3, M4, M7 with integrated DSP
- STM32 series
- Raspberry Pi Pico and Pico 2
- Modern MCUs with DSP extensions
- ESP32 and other IoT processors

### 5. **Hardware Features** (Purple)
- SIMD instructions (ARM Neon, Intel AVX)
- GPU acceleration (CUDA)
- ARM Helium vector extensions
- RISC-V vector extensions

## Interactive Features

- **Zoom Controls**: Zoom in/out to see different time scales
- **Era Navigation**: Jump to Early History, DSP Era, or Modern Era
- **Tooltips**: Hover over events for detailed descriptions
- **Grouped Display**: Events are organized by category with color coding

## View the Timeline



## Educational Value

This timeline is particularly useful for:

- Understanding the historical context of FFT development
- Seeing the relationship between algorithmic advances and hardware evolution
- Appreciating how DSP moved from dedicated chips to integrated MCU features
- Following the progression from floating-point DSPs to modern ARM Cortex-M processors
- Understanding why the Raspberry Pi Pico 2 (RP2350) with Cortex-M33 is significant

## Relevance to This Course

This course focuses on **benchmarking FFT implementations on modern microcontrollers**, particularly:

- ARM Cortex-M4 and M33 processors (like those in Raspberry Pi Pico 2)
- Understanding trade-offs between integer and floating-point FFT
- Leveraging DSP instructions for performance
- Using standard libraries (CMSIS-DSP) vs. custom implementations

The timeline shows how we arrived at today's powerful yet affordable microcontrollers that can perform real-time FFT operations that once required expensive dedicated DSP chips.

## Data Format

The timeline data is stored in `fft-timeline.json` using the [vis-timeline data format](https://visjs.github.io/vis-timeline/docs/timeline/#Data_Format):

```json
{
  "items": [
    {
      "id": 1,
      "content": "Event name",
      "start": "YYYY-MM-DD",
      "type": "point",
      "group": "category",
      "title": "Detailed description"
    }
  ],
  "groups": [...]
}
```

## References

- Cooley, J. W., & Tukey, J. W. (1965). "An algorithm for the machine calculation of complex Fourier series"
- Frigo, M., & Johnson, S. G. (1997). "FFTW: An adaptive software architecture for the FFT"
- ARM CMSIS-DSP Software Library Documentation
- Texas Instruments TMS320 DSP History
