# Notes on: Decoders

Tags: AI, ML

# Summary

## Notes

---

**The Decoder**

- The Decoder is used to generate the **output sequence**
    - The output of the encoder stack is used to generate attention matrices, **V and K.**
        - These matrices are what are used in the encoder-decoder attention layer to help the decoder focus on relevant meaning/position of the input sequence.
    - The encoder-decoder attention layer is like the regular attention layer (mutli-headed, using  Q/K/V Matrices)
        - except it gets the K/V Matrices from the output of the Encoder Stack
        - The Q Matrix from the Decoder Attention Layer
    - The decoder stack goes through one complete iteration to output the next token in the sequence.
        - The decoders first iterations input is the output from the encoder stack.
        - All subsequent  iterations input are the output of the decoders previous iteration
    - This is done until a special symbol is reach indicating to the decoder that the completed output has been achieved.

- In order to turn the output of the decoder stack which is a
    - Vector of floats
- The output is passed through a Linear Layer
    - A fully connected neural network
    - Used to project the vectors produced by the decoders, into a much larger vector
        - Linear Layer Vector Output is called a
            - Logits Vector
            - Logits Vector Size corresponds to models Vocabulary Size
            - A model that knows 10k words, would have a logits vector of 10k cells; Each cell corresponding to the score of the unique word
- Then an Softmax Layer
    - The softmax layer turns the logits vector into all positive scores that add up to 1.
    - The cell with the highest probability (score) is chosen
    - the word associated with the cell is produced as the output for this time step (decoder iteration).

## Cues

---

- [Encoders](https://www.notion.so/Notes-on-Encoders-1597cb35b91680cc9f67d7da97d78da8?pvs=21)
- [Attention Layer](https://www.notion.so/Notes-on-Attention-Layer-1597cb35b91680d9a9a6eb2411d762ad?pvs=21)
- [Normalization](https://www.notion.so/Notes-On-Normalization-1597cb35b916808ca1b9f03a9258dabd?pvs=21)

**Assets**

---

**Encoder and Decoder Architecture Differences**

![image.png](Notes%20on%20Decoders%201597cb35b916808c8505def0924e913f/image.png)

**Encoder/Decoder Normalization step**

![image.png](Notes%20on%20Decoders%201597cb35b916808c8505def0924e913f/image%201.png)

**References**

---

-