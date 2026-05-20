
class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2.5rem;
          border-radius: 1.5rem;
          background-color: #2a2a2a;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
          width: fit-content;
          max-width: 95vw;
        }

        .lotto-title {
            font-size: 2.5rem;
            color: #f0f0f0;
            text-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff;
            margin: 0;
            text-align: center;
        }

        .sets-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            width: 100%;
        }

        .lotto-set {
            display: flex;
            gap: 0.8rem;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 1rem;
            transition: background 0.3s ease;
        }

        .lotto-set:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .lotto-ball {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            font-weight: bold;
            color: #ffffff;
            box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 0 12px rgba(255, 255, 255, 0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .lotto-ball:hover {
            transform: scale(1.15) rotate(5deg);
            box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 0 20px rgba(255, 255, 255, 0.8);
        }

        .generate-button {
            padding: 1.2rem 2.5rem;
            font-size: 1.4rem;
            border-radius: 0.8rem;
            border: none;
            background-image: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px 0 rgba(116, 79, 168, 0.6);
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .generate-button:hover {
            background-image: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
            box-shadow: 0 8px 25px 0 rgba(46, 61, 230, 0.7);
            transform: translateY(-3px);
        }

        .generate-button:active {
            transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          :host {
            padding: 1.5rem;
            gap: 1.5rem;
          }
          .lotto-ball {
            width: 42px;
            height: 42px;
            font-size: 1.1rem;
          }
          .lotto-title {
            font-size: 1.8rem;
          }
          .lotto-set {
            gap: 0.5rem;
            padding: 0.8rem 0.5rem;
          }
          .generate-button {
            padding: 1rem 1.8rem;
            font-size: 1.1rem;
          }
        }
      </style>
      <h1 class="lotto-title">Lotto Number Generator</h1>
      <div class="sets-container"></div>
      <button class="generate-button">Generate 5 Sets</button>
    `;

    this.setsContainer = this.shadowRoot.querySelector('.sets-container');
    this.generateButton = this.shadowRoot.querySelector('.generate-button');

    this.generateButton.addEventListener('click', () => this.generateNumbers());
    this.generateNumbers(); // Generate numbers on initial load
  }

  generateNumbers() {
    const allSets = [];
    for (let i = 0; i < 5; i++) {
      const numbers = new Set();
      while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
      }
      allSets.push(Array.from(numbers).sort((a, b) => a - b));
    }
    this.renderNumbers(allSets);
  }

  getBallColor(number) {
    if (number <= 10) return 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)'; // Yellow
    if (number <= 20) return 'linear-gradient(135deg, #2AFADF 0%, #4C83FF 100%)'; // Blue
    if (number <= 30) return 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)'; // Red
    if (number <= 40) return 'linear-gradient(135deg, #C4E538 0%, #42B883 100%)'; // Green
    return 'linear-gradient(135deg, #BCC5CE 0%, #929EAD 100%)'; // Grey
  }

  renderNumbers(allSets) {
    this.setsContainer.innerHTML = '';
    allSets.forEach((set, index) => {
      const setRow = document.createElement('div');
      setRow.classList.add('lotto-set');
      setRow.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
      setRow.style.opacity = '0';
      
      // Keyframe animation for row entry
      if (!this.shadowRoot.querySelector('#fadeInStyle')) {
          const style = document.createElement('style');
          style.id = 'fadeInStyle';
          style.textContent = `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `;
          this.shadowRoot.appendChild(style);
      }

      set.forEach(number => {
        const ball = document.createElement('div');
        ball.classList.add('lotto-ball');
        ball.textContent = number;
        ball.style.background = this.getBallColor(number);
        setRow.appendChild(ball);
      });
      this.setsContainer.appendChild(setRow);
    });
  }
}

customElements.define('lotto-generator', LottoGenerator);
