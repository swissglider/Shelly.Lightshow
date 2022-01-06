# Shelly Lightshow

## Idea

The idea behind this project is to listen to the music through a microphone, analyze it using some algorythms and control different light sources according to the algorythms. For my christmas party ;-)

The app should run as a PWA and thus also go via the iPhone.
The lights are in a first step all lights, which are connected via a Shelly flush module, and can be controlled via an HTTP command. (Only on and off)

## Implementation

It is implemented as a PWA with Service Worker, so it can be used both in the browser and on a smart phone

### GUI

The GUI is implemented with REACT and Grommet.

### Audio Part

Reading, analyzing and algorithmizing audio data is realized with the HTML5 Web Audia API.

### Save local configuration

This has been implemented with dexie to store all configuration localy nothin in the cloud..

## Challanges

### Audio

Write different algorythms for different light sources. I first had to get deeply involved with audio.

### PWA - Access to the microphone

Accessing the microphone from an iPhone was a challenge because only "real" PWAs are allowed. This includes signed and validated HTTPS certificates.

To solve this, I host the app without any configuration on the Github pages Cloud. --> see link below

This way I always have a correct certificate.

### Access HTTP links on the shelly

How can I access a device from a PWA that only has a plain HTTP interface. This is unfortunately the case with the Shelly !

Unfortunately I have not found the solution :-(

## Usage

Wie oben beschrieben konnte ich alles implementieren, ausser von einer PWA auf die Shelly zuzugreifen.

Natürlich ist dies die wichtigste Anforderung gewesen, damit ich mir meine Lichter anhand der Weihnachtsmusik automatisch steuern kann.

Da die Weihnachten sehr schnell da waren, hatte ich keine Zeit mehr um das letzte Problem zu lösen.

## Finally

Fortunately, I was able to run the app locally as a developer, and access it via localhost using the Chrome browser.

So I could read music from the laptop via the mic and via the chrome browser I could at least send the HTML commands to the shelly, even if I couldn't get a response (which I don't need).

So we had a lot of fun at the christmas light show.

## Link to the PWA APP

https://swissglider.github.io/Shelly.Lightshow/

## Todo

-   Get a solution for Shelly's HTTP Request ..
-   Add other Lights like HUE to also have colors ;-)
-   .... up to your imagination

## Conclusion

I had learned a lot about Audio and PWA again and we had a lot of fun on the christmas party...

This projct for sure is not finished, is not well designed and and and, but it should me what you can do within hours just for fun ....

Probably next Christmas I will work on it again or start it from the beginning ;-)
