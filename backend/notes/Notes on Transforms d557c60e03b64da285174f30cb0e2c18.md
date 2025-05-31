# Notes on: Transforms

Tags: AI, ML

# Summary

---

A Transformer is a type of Machine Learning Model Architecture.

It can be trained to predict the most probable output given an input.

Outputs and Inputs are determined by the dataset used during training of the model.

Currently (2024), the most used applications of the transformer model are Large Language Models. (GPT, BART, ect.)

## Notes

---

- Can be used in a myriad of different applications,
    - I.E In a machine translation application, it would take a sentence in one language, and output its translation in another.

**Model Architecture Overview**

- A transformer is made up of two components
    - A Encoder Stack
    - A Decoder Stack
- Some transformer implementations only contain one (LLM for example only contain an decoder stack)

[**The Encoder**](https://www.notion.so/Notes-on-Encoders-1597cb35b91680cc9f67d7da97d78da8?pvs=21)

[**Normalization**](https://www.notion.so/Notes-On-Normalization-1597cb35b916808ca1b9f03a9258dabd?pvs=21)

[**The Decoder**](https://www.notion.so/Notes-on-Decoders-1597cb35b916808c8505def0924e913f?pvs=21)

[**Attention Layer**](https://www.notion.so/Notes-on-Attention-Layer-1597cb35b91680d9a9a6eb2411d762ad?pvs=21)

- The transformer model uses something called **multi-headed attention**
    - Instead of only processing input of encoder/decoders by one set of Query/Key/Value matrices, the transformer model runs the same operation 8 times with 8 different sets of Q/K/V matrices in order to try to capture more accurate semantic meaning into the output token.
    - At each attention sublayer, the operation is occurring 8 times.
- In order for the model to understand the ordering of the words in the **initial input embedding,** a positional vectors is added to each input vector that defines the words position in the original input
    - The methodology behind this is that we can figure out the distance between words based on the values that were added to the initial input vectors when the initial input vectors are projected by the Q/K/V matrices.
    - These positional vectors follow a specific pattern, which the model learns, that is used to figure out the distance between words.

### Transformer Architecture Training.

---

1. The weights are initialized randomly (Encoder/Decoder/Attention Matrices)
2. The model goes through the exact same process (input → encoder → decoder → output)
3. We compare the output to the associated label(desired output given an input) for a sample in the dataset used for training
    1. essentially checking its accuracy each iteration 
    
           [feature → label]
    
4. After a number of predetermined Epochs, we end up with a Trained Model

**Training in Details.** 

1. We encode a collection of vector (of dimension equal to the vocabulary size of the model): For each word in the dictionary
    1. We **one-hot encode** the word in a vector instance
        1. all other values in the vector are zero, except the value that is associated with the word
2. During each Iteration, we compare the untrained models output to the dataset’s current sample’s label
    1. We compare the probability distributions at each position (label vs output)
        1. Comparing the two probability distributions is done by subtracting one from the other
            1. [cross-entropy](https://colah.github.io/posts/2015-09-Visual-Information/) and [Kullback–Leibler divergence](https://www.countbayesie.com/blog/2017/5/9/kullback-leibler-divergence-explained) - look for deeper dive
        2. We use the the error rate between calculated by the the result of the difference between the probability distributes to update the models parameters for the next iteration. 
3. By the end of the training we would like the models probability distributions to look alot like the Datasets Label Probability Distribution

---

- Transformers Steps
    1. Words are embedded to transform text/tokens into vectors that could be input into the encoder/decoder
    2. The encoder receives a list of vectors each the size of 512.
        1. For the first stack(encoder/decoder), receives the list of embeddings,
        2. All other components receive the output of the previous step
    3.  The list of vectors gets passed into the self attention layer
    4. Then the output gets passed into the feed forward neural network.

## Cues

---

- **Transformers**
    - proposed in the paper [Attention is All You Need](https://arxiv.org/abs/1706.03762).
    - A Machine Learning Model
- Encoder Stack
    - Made up encoder units
- Decoder Stack
    - Made up of decoder units
- [Encoders](https://www.notion.so/Notes-on-Encoders-1597cb35b91680cc9f67d7da97d78da8?pvs=21)
- [Decoders](https://www.notion.so/Notes-on-Decoders-1597cb35b916808c8505def0924e913f?pvs=21)
- [Attention Layer](https://www.notion.so/Notes-on-Attention-Layer-1597cb35b91680d9a9a6eb2411d762ad?pvs=21)
- Feed Forward Neural Layer
- Question: What’s the difference between Encoder and Decoders?
- What is the difference purpose of each?
- vectors/tensors
- NLP (Natural Language Processing)
- Embedding Algorithm
- Softmax
- Final Linear
- mutli-headed attention

[positional vectors](https://www.notion.so/positional-vectors-13f7cb35b91680e791efe471231c4d09?pvs=21)

- Logits Vectors
- **one-hot encode**
- greedy decoding
- beam search
- Loss Function
- Parameters
- Question: What are Parameters?
- Are parameters and weights the same thing?

### Assets

---

**Transformer Architecture**

![image.png](Notes%20on%20Transforms%20d557c60e03b64da285174f30cb0e2c18/image.png)

### References

---

- [https://jalammar.github.io/illustrated-transformer/](https://jalammar.github.io/illustrated-transformer/)
- [layer-normalization](https://arxiv.org/abs/1607.06450)
- https://arxiv.org/abs/1706.03762