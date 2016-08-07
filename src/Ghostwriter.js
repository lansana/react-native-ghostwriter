import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text
} from 'react-native';
import util from './util';

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
            onComplete: () => {
            }
        };
    }

    /**
     * Component mounted.
     */
    componentDidMount() {
        this.setState(util.extend(this.state, this.props.options));

        setTimeout(() => {
            this.initGhostwriter();

            if (this.state.showCursor) {
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
                    <Text style={this.cursorStyles()}>
                        {this.state.cursorChar}
                    </Text>
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
     * The styles for our string.
     *
     * @returns {*}
     */
    stringStyles() {
        return this.state.stringStyles ? this.state.stringStyles : styles.string;
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

        this.write(sequences, seqId, charId, util.humanSpeed(this.state.writeSpeed));
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
            return this.state.onComplete();
        }

        typeTimeout = setTimeout(() => {
            let char = sequences[seqId].string[charId];

            // There are still chars in this sequence
            if (!util.isUndefined(char)) {
                // Move to next char
                charId++;

                // Add new letter to string
                this.setState({
                    string: this.state.string + char,
                    writing: true
                });

                this.write(sequences, seqId, charId, util.humanSpeed(this.state.writeSpeed));
            } else {
                // Call the callback function of the sequence
                this.callback(sequences, seqId);

                let duration;

                // Get the duration for the next sequence. Use custom duration
                // if provided by user, else use default.
                if (util.has(sequences[seqId], 'duration')) {
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

        util.arrayEach(sequences, (sequence, i) => {
            if (util.has(sequence, 'string')) {
                sequences[i].string = sequence.string.split('');
            } else {
                throw new Error("Your sequences must all contain a 'string' property.");
            }
        });

        return sequences;
    }

    /**
     * Call the callback function of a specific sequence.
     *
     * @param sequences
     * @param seqId
     */
    callback(sequences, seqId) {
        if (util.has(sequences[seqId], 'callback')) {
            if (util.isFunction(sequences[seqId].callback)) {
                sequences[seqId].callback();
            } else {
                throw new Error(`The callback for sequence #${seqId} is must be a function`);
            }
        }
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
    cursorShown: {
        fontSize: 18
    },
    cursorHidden: {
        opacity: 0,
        fontSize: 18
    }
});

export default Ghostwriter