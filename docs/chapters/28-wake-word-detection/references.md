# References: Wake Word Detection: Listening for a Trigger Phrase on a Dual-Core Pico 2 W

1. [ESP-Skainet](https://github.com/espressif/esp-skainet) - Espressif Systems - Espressif's official offline wake word and speech command engine for the ESP32-S3, combining a WakeNet detection model with a MultiNet command-recognition model; reports false accept rates under roughly 2% in typical home background noise, the real-world benchmark this chapter's false-accept-rate discussion is grounded in.

2. [Efficient Polish-Language Keyword Spotting on Microcontrollers: Compact Neural Architectures, Quantization, and On-Device Validation on the Raspberry Pi Pico 2](https://www.mdpi.com/2076-3417/16/15/7844) - MDPI Applied Sciences - A peer-reviewed study benchmarking CNN, CRNN, and DS-CNN keyword-spotting architectures directly on the RP2350 (Pico 2), with INT8 quantization and on-device latency measurement — the closest existing precedent to a trained-model version of this chapter's on-device inference.

3. [pico-wake-word](https://github.com/henriwoodcock/pico-wake-word) - Henri Woodcock - A port of TensorFlow Lite for Microcontrollers' `micro_speech` example to the original Raspberry Pi Pico (RP2040), detecting the words "yes" and "no" with a 20 KB model over a PDM microphone — a minimal single-core reference point to contrast against this chapter's dual-core design.

4. [Porcupine](https://github.com/Picovoice/porcupine) - Picovoice - A production-grade, cross-platform wake word engine with official demos driving a Raspberry Pi and ReSpeaker microphone HAT, illustrating the trained-neural-network alternative to this chapter's template-correlation enrollment approach.

5. [Getting Started with ReSpeaker 2-Mic Pi HAT](https://wiki.seeedstudio.com/ReSpeaker_2_Mics_Pi_HAT_Raspberry/) - Seeed Studio - Documents a Raspberry Pi microphone HAT built specifically for far-field voice capture and wake word work, useful context for what a genuine multi-microphone smart speaker front end looks like beyond this chapter's single-microphone kit.

6. [google/speech_commands](https://huggingface.co/datasets/google/speech_commands) - Hugging Face / Google - The standard public dataset of roughly 105,000 one-second spoken-word recordings, the reference format and scale for the kind of recorded-speech test set this chapter's false-accept/false-reject measurement should be built from.

7. [ei-keyword-spotting](https://github.com/ShawnHymel/ei-keyword-spotting) - Shawn Hymel / Edge Impulse - A practical, well-documented MFCC-plus-neural-network keyword-spotting pipeline, including dataset curation from custom recordings mixed with background noise, deployed to Arduino and STM32 microcontrollers — a good next read for building the trained-model side of this chapter's enrollment comparison.
