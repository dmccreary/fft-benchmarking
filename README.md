# FFT Benchmarking Course

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![MkDocs](https://img.shields.io/badge/docs-mkdocs-blue.svg)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/material-docs-blue.svg)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-success.svg)](https://dmccreary.github.io/fft-benchmarking/)

**🌐 Visit the Course Website:** [https://dmccreary.github.io/fft-benchmarking/](https://dmccreary.github.io/fft-benchmarking/)

## Overview

An educational resource for learning how to objectively benchmark Fast Fourier Transform (FFT) algorithms on microcontrollers and CPUs. This 10-week college course is designed for juniors and seniors with an interest in signal processing, focusing on modern ARM Cortex-M processors like those found in the Raspberry Pi Pico 2.

### What You'll Learn

- FFT algorithm fundamentals and DSP hardware acceleration
- Benchmarking methodologies for comparing FFT implementations
- ARM Cortex-M33 and M4 DSP instruction sets
- Trade-offs between integer and floating-point implementations
- Real-time signal processing on affordable microcontrollers ($6 Raspberry Pi Pico 2)
- Performance visualization and analysis techniques

## Course Structure

The course covers:
- **Foundations:** Fourier transforms, FFT algorithms, butterfly operations
- **Hardware:** ARM DSP instructions, microcontroller architectures
- **Implementation:** C language, Python libraries, assembly language analysis
- **Benchmarking:** Performance frameworks, parameter optimization, result presentation
- **Practical Application:** Real-time FFT/iFFT on Raspberry Pi Pico RP2350

## Getting Started

### Prerequisites

- Python 3.x
- Git

### Local Development

1. **Clone the repository:**
   ```sh
   git clone https://github.com/dmccreary/fft-benchmarking.git
   cd fft-benchmarking
   ```

2. **Set up Python environment:**
   ```sh
   # Using conda (recommended)
   conda create -n mkdocs python=3
   conda activate mkdocs
   pip install mkdocs "mkdocs-material[imaging]"

   # OR using venv
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install mkdocs "mkdocs-material[imaging]"
   ```

3. **Run local development server:**
   ```sh
   mkdocs serve
   ```

   View the site at [http://localhost:8000](http://localhost:8000)

4. **Build the site:**
   ```sh
   mkdocs build
   ```

### Deploying to GitHub Pages

```sh
mkdocs gh-deploy
```

Note: This only deploys the site. Remember to commit and push your source changes separately.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

This course and website would not be possible without the contributions of the open-source community and academic institutions:

### Educational Resources
- **[Cornell University ECE4760](https://people.ece.cornell.edu/land/courses/ece4760/)** - Professor Bruce Land's excellent course materials on real-time FFT/iFFT implementation on the Raspberry Pi Pico RP2350, which provide practical examples of DSP on embedded systems

### Open Source Projects
- **[MkDocs](https://www.mkdocs.org/)** - Fast, simple static site generator for building project documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Beautiful and feature-rich theme that powers this site
- **[GitHub Pages](https://pages.github.com/)** - Free hosting for open-source educational content

### FFT Libraries and Implementations
- **ARM CMSIS-DSP** - Optimized DSP library for ARM Cortex-M processors
- **FFTW (Fastest Fourier Transform in the West)** - Highly optimized FFT library
- **Kiss FFT** - Simple, portable FFT library
- **Pico SDK** - Raspberry Pi Pico development libraries with hardware-accelerated DSP functions
- All open-source FFT implementers who have contributed benchmarking code and performance data

### Hardware Platforms
- **ARM** - For developing DSP-capable Cortex-M processors
- **Raspberry Pi Foundation** - For making real-time signal processing affordable with the $6 Pico 2 (RP2350)

### Community
Thank you to all students, educators, and developers who contribute to making signal processing education accessible and practical.

## License

This content is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to:
- **Share** - copy and redistribute the material
- **Adapt** - remix, transform, and build upon the material

Under the following terms:
- **Attribution** - Give appropriate credit
- **NonCommercial** - Not for commercial purposes
- **ShareAlike** - Distribute contributions under the same license

---

**Maintained by:** [Dan McCreary](https://github.com/dmccreary)

**Website:** [https://dmccreary.github.io/fft-benchmarking/](https://dmccreary.github.io/fft-benchmarking/)
