import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text
} from 'react-native';

let typeTimeout = null;
let cursorInterval = null;

class Ghostwriter extends Component {

    /**
     * Class constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            startDelay: 0,
            string: '',
            stringStyles: null,
            containerStyles: null,
            clearEverySequence: false,
            sequences: [],
            sequenceDuration: 1750,
            writeSpeed: 0,
            showCursor: true,
            cursorChar: '|',
            cursorSpeed: 400,
            cursorIndex: 0,
            writing: false,
            ghostwriterComplete: () => {}
        };
    }

    /**
     * Component mounted.
     */
    componentDidMount() {
        this.setState(this._extend(this.state, this.props.options));

        setTimeout(() => {
            this.initGhostwriter();

            if (this.state.showCursor && !this.state.writing) {
                cursorInterval = setInterval(() => {
                    this.flashCursor();
                }, this.state.cursorSpeed);
            }
        }, this.state.startDelay);
    }

    /**
     * Component preparing to unmount.
     */
    componentWillUnmount() {
        clearTimeout(typeTimeout);
        clearInterval(cursorInterval);
    }

    /**
     * Render the component.
     *
     * @returns {XML}
     */
    render() {
        return (
            <View style={this.containerStyles()}>
                <Text style={this.stringStyles()}>
                    {this.state.string}
                </Text>
                <Text style={this.cursorStyles()}>
                    {this.state.cursorChar}
                </Text>
            </View>
        );
    }

    /**
     * The styles for the scroll view.
     *
     * @returns {*}
     */
    containerStyles() {
        return this.state.containerStyles ? this.state.containerStyles : styles.container;
    }

    /**
     * The styles for the cursor.
     *
     * @returns {string}
     */
    cursorStyles() {
        return this.state.cursorIndex % 2 ? styles.cursorShown : styles.cursorHidden;
    }

    /**
     * The styles for our string.
     *
     * @returns {*}
     */
    stringStyles() {
        return this.state.stringStyles ? this.state.stringStyles : styles.string;
    }

    /**
     * Flash cursor functionality (increase index).
     */
    flashCursor() {
        this.setState({
            cursorIndex: this.state.cursorIndex + 1
        });
    }

    /**
     * Start typing the sequences provided by user.
     */
    initGhostwriter() {
        let sequences = this.getSequences(),
            seqId = 0,
            charId = 0;

        this.write(sequences, seqId, charId, this._humanSpeed(this.state.writeSpeed));
    }

    /**
     * More forward in the sequence. Adds one the next letter, or moves to the next sentence.
     *
     * @param sequences
     * @param seqId
     * @param charId
     * @param speed
     */
    write(sequences, seqId, charId, speed) {
        // Clear typeTimeout at beginning of all ticks to clear any previous ticks.
        clearTimeout(typeTimeout);

        let finished = seqId === sequences.length;

        // All sequences complete
        if (finished) {
            return this.state.ghostwriterComplete();
        }

        typeTimeout = setTimeout(() => {
            let char = sequences[seqId].string[charId];

            // There are still chars in this sequence
            if (typeof char !== 'undefined') {
                // Move to next char
                charId++;

                // Add new letter to string
                this.setState({
                    string: this.state.string + char,
                    writing: true
                });

                this.write(sequences, seqId, charId, this._humanSpeed(this.state.writeSpeed));
            } else {
                // Call the callback function of the sequence
                if (this._isFunc(sequences[seqId].callback)) {
                    sequences[seqId].callback();
                }

                let duration;

                // Get the duration for the next sequence. Use custom duration
                // if provided by user, else use default.
                if (sequences[seqId].hasOwnProperty('duration')) {
                    duration = sequences[seqId].duration;
                } else {
                    duration = this.state.sequenceDuration;
                }

                // If this is not the last sequence in the list of sequences...
                if (seqId !== sequences.length - 1) {
                    this.beforeNextSequence(duration - 100);
                }

                this.nextSequence(sequences, seqId, charId, duration);
            }
        }, speed);
    }

    /**
     * Prepare the string for the next sequence (e.g., add a space, or clear the string)
     *
     * @param duration
     */
    beforeNextSequence(duration) {
        this.setState({
            writing: false
        });

        setTimeout(() => {
            this.setState({
                string: this.state.clearEverySequence ? '' : this.state.string + ' '
            });
        }, duration);
    }

    /**
     * Jump to the next sequence and start at the first char.
     *
     * @param sequences
     * @param seqId
     * @param charId
     * @param duration
     */
    nextSequence(sequences, seqId, charId, duration) {
        // Move to next sequence
        seqId++;

        // Reset char index to start on first char of next sequence
        charId = 0;

        this.write(sequences, seqId, charId, duration);
    }

    /**
     * Get an array of sequences, each having their string split into an array of chars.
     *
     * @returns {Array}
     * @private
     */
    getSequences() {
        let sequences = this.state.sequences;

        this._each(sequences, (sequence, i) => {
            if (sequence.hasOwnProperty('string')) {
                sequences[i].string = sequence.string.split('');
            } else {
                throw new Error("Your sequences must all contain a 'string' property.");
            }
        });

        return sequences;
    }

    /**
     * Human speed typing.
     *
     * @param speed
     * @returns {*}
     * @private
     */
    _humanSpeed(speed) {
        return Math.round(Math.random() * (100 - 30)) + speed;
    }

    /**
     * Loop array and use callback on each item
     *
     * @param arr
     * @param callback
     * @private
     */
    _each(arr, callback) {
        let i = -1,
            len = arr.length;

        while (++i < len) {
            callback(arr[i], i, arr);
        }
    }

    /**
     * Merge two objects.
     *
     * Only set the value if 'source' already has it (no custom
     * props to prevent private props from being overridden).
     *
     * @param source
     * @param options
     * @returns {*}
     * @private
     */
    _extend(source, options) {
        let key;

        for (key in options) {
            if (source.hasOwnProperty(key) && options.hasOwnProperty(key)) {
                source[key] = options[key];
            }
        }

        return source;
    }

    /**
     * Check if something is a function.
     *
     * @param fn
     * @returns {*|boolean}
     * @private
     */
    _isFunc(fn) {
        let getType = {};
        return fn && getType.toString.call(fn) === '[object Function]';
    }

}

/**
 * Styles
 */
const styles = StyleSheet.create({
    container: {},
    string: {
        fontSize: 18,
        fontWeight: "300"
    },
    cursorShown: {},
    cursorHidden: {
        opacity: 0
    }
});

export default Ghostwriter
