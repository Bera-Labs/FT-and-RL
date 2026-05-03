export type MathArea = 'Calculus' | 'Linear Algebra' | 'Probability' | 'Statistics' | 'Information Theory' | 'Optimization' | 'Set Theory';

export interface MathConcept {
  topic: string;
  area: MathArea;
  why: string;
}

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  part: number;
  partTitle: string;
  description: string;
  mathConcepts: MathConcept[];
}

export const PARTS = [
  { number: 1, title: 'ML Foundations', range: [1, 7] },
  { number: 2, title: 'Fine-Tuning', range: [8, 18] },
  { number: 3, title: 'Reinforcement Learning', range: [19, 28] },
  { number: 4, title: 'RLHF & Capstone', range: [29, 30] },
  { number: 5, title: 'Modern Alignment & Retrieval', range: [31, 33] },
];

export const CHAPTERS: Chapter[] = [
  // Part 1 — ML Foundations
  {
    id: 1, slug: '01-what-is-ml', title: 'What is Machine Learning?', part: 1, partTitle: 'ML Foundations',
    description: 'Learn how machines learn by example, not by rules.',
    mathConcepts: [
      { topic: 'Functions f(x) = y', area: 'Set Theory', why: 'A model is just a function mapping inputs to outputs.' },
      { topic: 'Basic probability', area: 'Probability', why: 'Models often output probabilities, not hard answers.' },
      { topic: 'Mean & variance', area: 'Statistics', why: 'Used to understand and summarize training data.' },
    ],
  },
  {
    id: 2, slug: '02-neural-networks', title: 'Neural Networks', part: 1, partTitle: 'ML Foundations',
    description: 'How LEGO-like layers of numbers recognize patterns.',
    mathConcepts: [
      { topic: 'Vectors & dot products', area: 'Linear Algebra', why: 'A neuron computes a weighted sum: w · x + b.' },
      { topic: 'Matrix multiplication', area: 'Linear Algebra', why: 'Each layer is a matrix multiply: y = Wx + b.' },
      { topic: 'Non-linear functions', area: 'Calculus', why: 'ReLU and sigmoid are the activation functions used.' },
    ],
  },
  {
    id: 3, slug: '03-gradient-descent', title: 'How Models Learn: Loss & Optimization', part: 1, partTitle: 'ML Foundations',
    description: 'A blindfolded hiker finding the lowest valley.',
    mathConcepts: [
      { topic: 'Derivatives', area: 'Calculus', why: 'The gradient is the derivative of loss w.r.t. each weight.' },
      { topic: 'Partial derivatives', area: 'Calculus', why: '∂L/∂wᵢ tells us how each single weight affects loss.' },
      { topic: 'Gradient vector ∇L', area: 'Calculus', why: 'Collects all partial derivatives into one direction vector.' },
      { topic: 'Convex functions', area: 'Optimization', why: 'Convex loss surfaces have one valley; real losses usually do not.' },
    ],
  },
  {
    id: 4, slug: '04-backpropagation', title: 'Backpropagation', part: 1, partTitle: 'ML Foundations',
    description: 'How blame flows backwards through a network.',
    mathConcepts: [
      { topic: 'Chain rule', area: 'Calculus', why: 'Backprop is just the chain rule applied to nested functions.' },
      { topic: 'Computational graphs', area: 'Calculus', why: 'Represent the forward pass as a DAG to automate derivatives.' },
      { topic: 'Jacobian matrices', area: 'Linear Algebra', why: 'Generalization of derivatives to vector-valued functions.' },
    ],
  },
  {
    id: 5, slug: '05-overfitting', title: 'Overfitting & Generalization', part: 1, partTitle: 'ML Foundations',
    description: 'Memorizing the test vs. truly understanding the subject.',
    mathConcepts: [
      { topic: 'Bias–variance tradeoff', area: 'Statistics', why: 'Overfitting = low bias, high variance. Underfitting = the reverse.' },
      { topic: 'L1 & L2 norms', area: 'Linear Algebra', why: 'Regularization penalties use these norms on the weight vector.' },
      { topic: 'Cross-validation', area: 'Statistics', why: 'Systematic way to estimate generalisation error.' },
    ],
  },
  {
    id: 6, slug: '06-pretrained-models', title: 'Pre-trained Models', part: 1, partTitle: 'ML Foundations',
    description: 'Hiring an expert who already knows their field.',
    mathConcepts: [
      { topic: 'Feature spaces', area: 'Linear Algebra', why: 'A pre-trained model maps inputs to high-dimensional embedding vectors.' },
      { topic: 'Cosine similarity', area: 'Linear Algebra', why: 'Measures how "close" two embeddings are in feature space.' },
      { topic: 'Probability distributions', area: 'Probability', why: 'Language models output a distribution over the next token.' },
    ],
  },
  {
    id: 7, slug: '07-transformers', title: 'The Transformer & Attention Mechanism', part: 1, partTitle: 'ML Foundations',
    description: 'A spotlight that decides which words to focus on.',
    mathConcepts: [
      { topic: 'Softmax function', area: 'Probability', why: 'Converts raw attention scores into a probability distribution.' },
      { topic: 'Dot product attention', area: 'Linear Algebra', why: 'Attention(Q,K,V) = softmax(QKᵀ/√d)V.' },
      { topic: 'Positional encoding', area: 'Calculus', why: 'Sine/cosine functions encode token position in the sequence.' },
    ],
  },

  // Part 2 — Fine-Tuning
  {
    id: 8, slug: '08-what-is-finetuning', title: 'What is Fine-Tuning?', part: 2, partTitle: 'Fine-Tuning',
    description: 'Retraining an expert chef to specialize in sushi.',
    mathConcepts: [
      { topic: 'Loss functions', area: 'Optimization', why: 'Fine-tuning minimises a task-specific loss on new data.' },
      { topic: 'Learning rate schedules', area: 'Optimization', why: 'Fine-tuning uses small lr to avoid overwriting prior knowledge.' },
      { topic: 'Weight initialisation', area: 'Statistics', why: 'Fine-tuning starts from a pre-trained weight distribution, not random.' },
    ],
  },
  {
    id: 9, slug: '09-full-vs-peft', title: 'Full Fine-Tuning vs. Parameter-Efficient Methods', part: 2, partTitle: 'Fine-Tuning',
    description: 'Rebuilding a house vs. repainting the rooms.',
    mathConcepts: [
      { topic: 'Parameter counting', area: 'Linear Algebra', why: 'Full fine-tuning updates all N weights; PEFT updates only a small subset.' },
      { topic: 'Matrix rank', area: 'Linear Algebra', why: 'LoRA exploits the fact that weight updates are often low-rank.' },
      { topic: 'Frozen gradients', area: 'Calculus', why: 'Setting ∂L/∂w = 0 for frozen layers prevents their update.' },
    ],
  },
  {
    id: 10, slug: '10-dataset-building', title: 'Building a Fine-Tuning Dataset', part: 2, partTitle: 'Fine-Tuning',
    description: 'Curating the right study flashcards for your model.',
    mathConcepts: [
      { topic: 'Data distributions', area: 'Probability', why: 'Train/val/test splits must reflect the same underlying distribution.' },
      { topic: 'Shannon entropy', area: 'Information Theory', why: 'Measures diversity and informativeness of your dataset.' },
      { topic: 'Data augmentation', area: 'Statistics', why: 'Synthetic data generation via transformations; adds statistical variety.' },
    ],
  },
  {
    id: 11, slug: '11-transfer-learning', title: 'Transfer Learning in Depth', part: 2, partTitle: 'Fine-Tuning',
    description: 'Copying skills from one domain to another.',
    mathConcepts: [
      { topic: 'Covariate shift', area: 'Statistics', why: 'Domain mismatch between pre-train and fine-tune data.' },
      { topic: 'KL divergence', area: 'Information Theory', why: 'Measures how different the source and target distributions are.' },
      { topic: 'Representation similarity', area: 'Linear Algebra', why: 'CKA and cosine similarity compare feature spaces across tasks.' },
    ],
  },
  {
    id: 12, slug: '12-full-finetuning-walkthrough', title: 'Full Fine-Tuning Walkthrough', part: 2, partTitle: 'Fine-Tuning',
    description: 'Step-by-step: dataset → training loop → checkpoint.',
    mathConcepts: [
      { topic: 'Adam optimiser', area: 'Optimization', why: 'Adam uses first & second moment estimates of gradients.' },
      { topic: 'Gradient clipping', area: 'Calculus', why: 'Caps ‖∇L‖ to prevent exploding gradients.' },
      { topic: 'Weight decay', area: 'Optimization', why: 'L2 regularisation applied directly in the optimiser update.' },
    ],
  },
  {
    id: 13, slug: '13-lora', title: 'LoRA: Low-Rank Adaptation', part: 2, partTitle: 'Fine-Tuning',
    description: 'Sticky notes layered onto a textbook.',
    mathConcepts: [
      { topic: 'Matrix rank', area: 'Linear Algebra', why: 'LoRA decomposes ΔW = BA where rank(B,A) = r << d.' },
      { topic: 'Singular value decomposition', area: 'Linear Algebra', why: 'SVD explains why weight update matrices tend to be low-rank.' },
      { topic: 'Matrix factorisation', area: 'Linear Algebra', why: 'B (d×r) and A (r×k) together approximate a full d×k update.' },
    ],
  },
  {
    id: 14, slug: '14-qlora', title: 'QLoRA: Quantized LoRA', part: 2, partTitle: 'Fine-Tuning',
    description: 'Same sticky notes, but the textbook is compressed.',
    mathConcepts: [
      { topic: 'Quantisation', area: 'Information Theory', why: 'Mapping 32-bit floats to 4-bit integers reduces memory 8×.' },
      { topic: 'Floating point formats', area: 'Information Theory', why: 'BF16 trades mantissa precision for exponent range vs FP16.' },
      { topic: 'Quantisation error', area: 'Statistics', why: 'Rounding introduces noise; NF4 minimises this for normally distributed weights.' },
    ],
  },
  {
    id: 15, slug: '15-hyperparameters', title: 'Hyperparameters for Fine-Tuning', part: 2, partTitle: 'Fine-Tuning',
    description: 'Dials on a mixing board — what each one does.',
    mathConcepts: [
      { topic: 'Learning rate warmup', area: 'Optimization', why: 'Linearly ramp lr from 0 to target over N steps to stabilise early training.' },
      { topic: 'Cosine LR decay', area: 'Calculus', why: 'lr follows a half-cosine curve from peak down to near-zero.' },
      { topic: 'Batch size & gradient noise', area: 'Statistics', why: 'Larger batches give lower-variance but potentially sharper minima.' },
    ],
  },
  {
    id: 16, slug: '16-evaluation', title: 'Evaluating Your Fine-Tuned Model', part: 2, partTitle: 'Fine-Tuning',
    description: 'Grading an exam with a rubric.',
    mathConcepts: [
      { topic: 'Perplexity', area: 'Information Theory', why: 'PPL = exp(avg negative log-likelihood); lower = better language model.' },
      { topic: 'F1 score', area: 'Statistics', why: 'Harmonic mean of precision and recall for classification tasks.' },
      { topic: 'BLEU / ROUGE', area: 'Statistics', why: 'N-gram overlap metrics for comparing generated vs. reference text.' },
    ],
  },
  {
    id: 17, slug: '17-pitfalls', title: 'Common Pitfalls & Debugging', part: 2, partTitle: 'Fine-Tuning',
    description: 'Why your model is memorizing, not learning.',
    mathConcepts: [
      { topic: 'Gradient norms', area: 'Calculus', why: 'Monitoring ‖∇L‖ reveals vanishing or exploding gradient problems.' },
      { topic: 'Loss landscape curvature', area: 'Calculus', why: 'Sharp minima generalise worse; flat minima generalise better.' },
      { topic: 'Catastrophic forgetting', area: 'Optimization', why: 'Minimising task-B loss can erase task-A weights if lr is too high.' },
    ],
  },
  {
    id: 18, slug: '18-finetuning-capstone', title: 'Fine-Tuning Capstone', part: 2, partTitle: 'Fine-Tuning',
    description: 'End-to-end: fine-tune a model for a specific task.',
    mathConcepts: [
      { topic: 'Cross-entropy loss', area: 'Information Theory', why: 'Standard training objective: −∑ y log(ŷ).' },
      { topic: 'Validation loss curve', area: 'Statistics', why: 'Divergence between train and val loss signals overfitting onset.' },
      { topic: 'Early stopping', area: 'Optimization', why: 'Stop training when val loss stops improving to prevent overfitting.' },
    ],
  },

  // Part 3 — Reinforcement Learning
  {
    id: 19, slug: '19-what-is-rl', title: 'What is Reinforcement Learning?', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Training a dog with treats and corrections.',
    mathConcepts: [
      { topic: 'Expected value E[X]', area: 'Probability', why: 'The agent aims to maximise expected cumulative reward.' },
      { topic: 'Sequential decisions', area: 'Probability', why: 'Each action affects the next state, creating a chain of outcomes.' },
      { topic: 'Reward functions', area: 'Optimization', why: 'R(s,a) is what we optimise; its design determines agent behaviour.' },
    ],
  },
  {
    id: 20, slug: '20-rl-components', title: 'Agents, Environments, States, Actions, Rewards', part: 3, partTitle: 'Reinforcement Learning',
    description: 'A chess player, the board, the pieces, and the score.',
    mathConcepts: [
      { topic: 'State spaces', area: 'Set Theory', why: 'S is the set of all possible situations the agent can be in.' },
      { topic: 'Transition probability P(s\'|s,a)', area: 'Probability', why: 'Encodes the stochastic dynamics of the environment.' },
      { topic: 'Discount factor γ', area: 'Optimization', why: 'γ ∈ [0,1] controls how much future rewards are valued vs. immediate ones.' },
    ],
  },
  {
    id: 21, slug: '21-explore-exploit', title: 'The Explore vs. Exploit Dilemma', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Trying a new restaurant vs. going to your favourite.',
    mathConcepts: [
      { topic: 'Multi-armed bandit', area: 'Probability', why: 'The simplest RL problem; formalises the explore/exploit tradeoff.' },
      { topic: 'Upper confidence bounds', area: 'Statistics', why: 'UCB explores options whose value estimates have high uncertainty.' },
      { topic: 'ε-greedy strategy', area: 'Probability', why: 'With probability ε, pick a random action; otherwise pick the best known.' },
    ],
  },
  {
    id: 22, slug: '22-mdp', title: 'Markov Decision Processes', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Every choice depends only on where you are now.',
    mathConcepts: [
      { topic: 'Markov property', area: 'Probability', why: 'P(s\'|s,a) depends only on current state, not history.' },
      { topic: 'Bellman equations', area: 'Optimization', why: 'V(s) = R(s) + γ Σ P(s\'|s,a) V(s\') — recursive value definition.' },
      { topic: 'Geometric series', area: 'Calculus', why: 'Discounted return Σ γᵗrₜ converges because γ < 1.' },
    ],
  },
  {
    id: 23, slug: '23-q-learning', title: 'Q-Learning', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Building a GPS that learns which roads are fastest.',
    mathConcepts: [
      { topic: 'Q-function Q(s,a)', area: 'Optimization', why: 'Q(s,a) = expected total future reward from state s taking action a.' },
      { topic: 'Bellman optimality', area: 'Optimization', why: 'Q*(s,a) = R + γ max_{a\'} Q*(s\',a\') — the optimal Q satisfies this.' },
      { topic: 'Temporal difference error', area: 'Statistics', why: 'δ = r + γ max Q(s\') − Q(s,a) is the learning signal.' },
    ],
  },
  {
    id: 24, slug: '24-dqn', title: 'Deep Q-Networks (DQN)', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Teaching a neural network to read the GPS map.',
    mathConcepts: [
      { topic: 'Function approximation', area: 'Optimization', why: 'Q(s,a;θ) uses a neural network instead of a lookup table.' },
      { topic: 'Mean squared error', area: 'Statistics', why: 'DQN trains by minimising MSE between Q predictions and TD targets.' },
      { topic: 'Experience replay', area: 'Statistics', why: 'Sampling past transitions i.i.d. breaks temporal correlation in gradients.' },
    ],
  },
  {
    id: 25, slug: '25-policy-gradient', title: 'Policy Gradient Methods', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Directly adjusting your strategy, not the value map.',
    mathConcepts: [
      { topic: 'Policy π(a|s)', area: 'Probability', why: 'The policy is a probability distribution over actions given a state.' },
      { topic: 'Log-derivative trick', area: 'Calculus', why: '∇ log π(a|s) is how policy gradient flows through the log probability.' },
      { topic: 'Monte Carlo returns', area: 'Statistics', why: 'REINFORCE estimates gradient by sampling full episode trajectories.' },
    ],
  },
  {
    id: 26, slug: '26-actor-critic', title: 'Actor-Critic Methods', part: 3, partTitle: 'Reinforcement Learning',
    description: 'A player and a coach working together.',
    mathConcepts: [
      { topic: 'Advantage function A(s,a)', area: 'Optimization', why: 'A(s,a) = Q(s,a) − V(s) measures how much better an action is than average.' },
      { topic: 'Variance reduction', area: 'Statistics', why: 'Subtracting a baseline V(s) from returns lowers gradient variance.' },
      { topic: 'TD(λ) returns', area: 'Statistics', why: 'Generalised advantage estimation (GAE) interpolates between TD and MC returns.' },
    ],
  },
  {
    id: 27, slug: '27-ppo', title: 'Proximal Policy Optimization (PPO)', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Taking small, safe steps instead of giant leaps.',
    mathConcepts: [
      { topic: 'KL divergence', area: 'Information Theory', why: 'Measures how much the new policy deviates from the old one.' },
      { topic: 'Probability ratios', area: 'Probability', why: 'r(θ) = π_new(a|s) / π_old(a|s) is the importance sampling weight.' },
      { topic: 'Clipped objective', area: 'Optimization', why: 'clip(r, 1-ε, 1+ε) prevents destructively large policy updates.' },
    ],
  },
  {
    id: 28, slug: '28-rl-in-practice', title: 'RL in Practice: Tips & Common Traps', part: 3, partTitle: 'Reinforcement Learning',
    description: 'Why your agent keeps falling off the platform.',
    mathConcepts: [
      { topic: 'Reward shaping', area: 'Optimization', why: 'Modifying R(s,a) to provide denser feedback without changing the optimal policy.' },
      { topic: 'Entropy bonus', area: 'Information Theory', why: 'Adding H(π) to the objective encourages exploration by penalising certainty.' },
      { topic: 'Convergence conditions', area: 'Optimization', why: 'RL convergence requires sufficient exploration and decreasing step sizes.' },
    ],
  },

  // Part 4 — RLHF & Capstone
  {
    id: 29, slug: '29-rlhf', title: 'RLHF: Learning from Human Feedback', part: 4, partTitle: 'RLHF & Capstone',
    description: "A student rewriting essays based on a teacher's marks.",
    mathConcepts: [
      { topic: 'Bradley-Terry model', area: 'Probability', why: 'P(A≻B) = σ(r(A) − r(B)) — turns pairwise preferences into reward scores.' },
      { topic: 'KL penalty', area: 'Information Theory', why: 'KL(π_RL ‖ π_SFT) prevents the model from gaming the reward model.' },
      { topic: 'Logistic regression', area: 'Statistics', why: 'Reward model training is binary classification on preference pairs.' },
    ],
  },
  {
    id: 30, slug: '30-capstone', title: 'Capstone: Fine-Tuning + RLHF End-to-End', part: 4, partTitle: 'RLHF & Capstone',
    description: 'All pieces together: base model → fine-tune → RLHF.',
    mathConcepts: [
      { topic: 'Cross-entropy + PPO combined', area: 'Optimization', why: 'The final objective blends SFT loss, RM score, and KL penalty.' },
      { topic: "Reward hacking & Goodhart's Law", area: 'Statistics', why: 'When a measure becomes a target, it ceases to be a good measure.' },
      { topic: 'Constitutional AI objective', area: 'Information Theory', why: 'Uses AI feedback (RLAIF) to generate preference labels at scale.' },
    ],
  },

  // Part 5 — Modern Alignment & Retrieval
  {
    id: 31, slug: '31-dpo', title: 'DPO: Direct Preference Optimization', part: 5, partTitle: 'Modern Alignment & Retrieval',
    description: 'Skipping the reward model — align directly on preference pairs.',
    mathConcepts: [
      { topic: 'Log-probability ratios', area: 'Probability', why: 'DPO loss uses log(π_θ/π_ref) as an implicit reward signal.' },
      { topic: 'Bradley-Terry reformulation', area: 'Probability', why: 'DPO derives from substituting the optimal RLHF policy into the BT model.' },
      { topic: 'Binary cross-entropy', area: 'Information Theory', why: 'The DPO objective is structurally a binary classification loss on preference pairs.' },
    ],
  },
  {
    id: 32, slug: '32-rag', title: 'RAG: Retrieval-Augmented Generation', part: 5, partTitle: 'Modern Alignment & Retrieval',
    description: 'Open-book exam: look it up instead of memorizing everything.',
    mathConcepts: [
      { topic: 'Cosine similarity', area: 'Linear Algebra', why: 'sim(A,B) = A·B / (|A||B|) is how RAG ranks retrieved chunks.' },
      { topic: 'Approximate nearest neighbors', area: 'Optimization', why: 'ANN algorithms (HNSW, IVF) make vector search fast over millions of embeddings.' },
      { topic: 'Vector spaces', area: 'Linear Algebra', why: 'Embedding models map text to high-dimensional vectors where semantic similarity = geometric proximity.' },
    ],
  },
  {
    id: 33, slug: '33-grpo', title: 'GRPO: Group Relative Policy Optimization', part: 5, partTitle: 'Modern Alignment & Retrieval',
    description: 'Rate responses by comparing them to each other — no critic needed.',
    mathConcepts: [
      { topic: 'Sample mean & variance', area: 'Statistics', why: 'Group advantage A_i = (r_i − μ_r) / σ_r uses the sample mean as a baseline.' },
      { topic: 'KL divergence', area: 'Information Theory', why: 'KL(π_θ ‖ π_ref) penalty prevents the policy from drifting too far from SFT.' },
      { topic: 'Importance sampling', area: 'Probability', why: 'r_t = π_θ / π_old is the importance ratio used in the clipped PPO objective.' },
    ],
  },
];

export function getChapter(id: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getPrevNext(id: number): { prev: Chapter | null; next: Chapter | null } {
  const idx = CHAPTERS.findIndex((c) => c.id === id);
  return {
    prev: idx > 0 ? CHAPTERS[idx - 1] : null,
    next: idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null,
  };
}
