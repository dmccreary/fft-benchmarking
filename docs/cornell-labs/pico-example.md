# Cornell University ECE4760

[FFT/iFFT testing on the Pi Pico RP2350](https://people.ece.cornell.edu/land/courses/ece4760/RP2350/FFT_iFFT/index_FFT_iFFT.html)

!!! quote
From this web page:
Please explain this text. Assume you are talking to a high-school student. 

Cornell University ECE4760 FFT/iFFT testing Pi Pico RP2350 Fast Fourier Trnasform and inverse Fast Fourier Transform. Some interesting audio algorithms (e.g. speech compression, effects) work in the frequency domain by doing a FFT on the input signal, fiddling with the frequency components, then transforming back to time domain for output. Since the FFT is a framed computation (works on a stored buffer of input values) you need to be concerned about input-to-output time delay and correctly interpolating from one frame to the next to avoid extremely annoyng artifacts. The approach taken here is to make sure that there is enough information to reasonably interpolate between frames at both the input and output. The steps in the process are: Input samples from ADC at 12.8 Ksamples/sec into a buffer. In the case 512 samples long, which gives 25 FFT frames per second. But with 50% overlap, a new frame starts 50 times/sec. Use a raised cosine window to taper input data to zero at ends of buffer. This is necessary to force periodicity on arbierary input signals. Since the window function goes to zero near both ends, all data is lost there! The windowing means that we need to actually do a FFT on 512 samples, but with only 256 samples separeating the beginning of each transform. This 50% overlap ensures that all data is represented in the FFT output. Do the 512 point FFT with 50% overlap so that no data gets completely lost. Normally here, there would be some sort of filtering, but for this example there is none. We are just verifying that the FFT/iFFT pair reproduces the input. Do iFFT on 512 complex points resulting from the forward FFT. Optionally, window the output of the iFFT (this example does not) before averaging We construct the output buffer by averaging the 50% overlap between iFFTs. This minimizes the inevitable discontinuity between successive transforms. Also, a little thought about data rates will convince you that you need to average the last half of each iFFT output with the first half of the next one to get back to the original sample rate. Construct output buffer of the averaged 50% overlap samples by scaling and offset, Send to DAC at the same rate at the input. The algorithm runs in two parts.: An ISR fills input buffers from the ADC, signals a full input buffer to the thread, and pushes an output buffer to the DAC via SPI. A thread (with a strict time deadline of 256 sample times) runs the windowing, FFT, iFFT, fills an output buffer, and signals the ISR when a new output buffer is ready. There is either a signal generator or microphone attached to ADC channel 2. An SPI channel runs the DAC. VGA output comnections are explained in the code, but the program will run without any VGA connection. Audio examples coming soon.
!!!!

Here's a **high-school-level explanation** of that Cornell University ECE4760 description about the **Fast Fourier Transform (FFT)** on the **Raspberry Pi Pico RP2350**:

* * * *

### 🎵 What's Going On

This project is about how computers can **analyze and modify sound** --- like music or voices --- using math.

When sound enters a microphone, it's a **waveform over time** (called the *time domain*).
But many cool audio effects (like speech compression, pitch shifting, or equalizers) work better if you look at the sound as **a collection of frequencies** --- the *frequency domain*.

To switch between these two ways of viewing sound, engineers use special math tools:

-   **FFT** (Fast Fourier Transform) → converts sound *from time → frequency*

-   **iFFT** (inverse FFT) → converts sound *from frequency → time*

* * * *

### ⚙️ The Process Step-by-Step

1.  **Record sound**
    The Pi Pico's ADC (analog-to-digital converter) samples the sound 12,800 times per second and stores small chunks (called *buffers*) of 512 samples each.

    -   This means you get about **25 frames per second** of data.

2.  **Overlap the frames**
    To make the sound smooth, the program starts a new frame halfway through the previous one --- this is called **50% overlap**.

    -   It helps avoid pops or clicks when frames join together.

3.  **Windowing (smoothing the edges)**
    Before running the FFT, each frame is multiplied by a **raised cosine window** --- a curve that fades the beginning and end of the data toward zero.

    -   This makes the signal "look" more periodic and prevents sharp jumps that cause distortion.

    -   The trade-off: some data near the edges is lost, so overlapping frames helps recover it.

4.  **FFT and (optionally) modify frequencies**
    The FFT turns that 512-sample frame into 512 numbers showing how strong each frequency is.

    -   In a real effect, you might change these (boost bass, reduce noise, etc.), but in this lab, they're left unchanged.

5.  **iFFT back to sound**
    The iFFT reverses the process, turning the frequency data back into time-domain samples.

6.  **Blend overlapping frames**
    Because of the 50% overlap, the second half of one frame and the first half of the next frame are **averaged together**.

    -   This blending ensures the playback is smooth and the timing matches the input rate.

7.  **Send to speaker**
    The DAC (digital-to-analog converter) sends the processed signal out at the same speed (12.8 kHz), reproducing the original (or modified) sound.

* * * *

### 🧠 How the Code Runs

There are **two main parts** of the program:

-   **ISR (Interrupt Service Routine)**:
    Works like a super-fast helper that grabs microphone data and sends finished output to the DAC.
    It quickly fills and empties buffers while the main program thinks.

-   **Main Thread**:
    Runs the FFT, iFFT, and averaging math.
    It must finish within the time it takes to collect 256 samples (because of the 50% overlap).
    That's a tight deadline --- it tests whether the code is efficient.

* * * *

### 🧩 Why It Matters

This lab shows how real-time digital audio works on a tiny computer.
It teaches key engineering ideas like:

-   Sampling and data rates

-   Buffering and frame overlap

-   Frequency-domain processing

-   Synchronizing input and output

Once you understand this, you can build effects like:

-   Echo, pitch-shift, auto-tune

-   Noise cancellation

-   Equalizers (like the **bass & treble** MicroSim you uploaded)