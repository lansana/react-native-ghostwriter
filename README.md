# Ghostwriter

A React Native module that types strings on demand. Set up your Ghostwriter with custom options, and watch it do its magic.

Inspired by [Typed.js](https://github.com/mattboldt/typed.js/)

## Installation

```bash
    npm install react-native-ghostwriter
```

## Usage

```js
    import React, { Component } from 'react';
    import { View } from 'react-native';
    import Ghostwriter from 'react-native-ghostwriter';

    class App extends Component {
        let options = {
            sequences: [
                { string: 'Hello!', duration: 1000 },
                { string: 'My name is Ghostwriter.', duration: 2500 },
                { string: 'Try me out!' }
            ]
        };

        render() {
            return (
                <View>
                    <Ghostwriter options={options} />
                </View>
            );
        }
    }
```

## Documentation

Option | Type | Default | Description
-------|------|---------|------------
clearEverySequence | Boolean | false | If true, each sequence is cleared after it's specified duration
startDelay | Int | 0 | The time (milliseconds) to wait before the typing starts
stringStyles | Object | null | Add custom styles to your sequences
containerStyles | Object | null | Add custom styles to the container of your sequences
sequenceDuration | Int | 1750 | The time (milliseconds) to wait after each sequence before moving to the next sequence. Overridden by the 'duration' property in sequence.
writeSpeed | Int | 0 | A value that represents the speed of the typer. The lower you go, the faster it types.
showCursor | Int | true | Set to false for no cursor
cursorChar | String | "|" | The cursor character
cursorSpeed | Int | 0 | The speed (in milliseconds) at which the cursor flashes
ghostwriterComplete | Function | No operations | A callback function that is called after all sequences have been typed

## License

The MIT License (MIT)

Copyright (c) 2016 Lansana Camara

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.