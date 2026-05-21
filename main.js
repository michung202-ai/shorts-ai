class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = \`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2.5rem;
          border-radius: 1.5rem;
          background-color: var(--container-bg);
          box-shadow: 0 15px 35px var(--card-shadow);
          width: fit-content;
          max-width: 95vw;
          transition: all 0.3s ease;
        }

        .lotto-title {
            font-size: 2.5rem;
            color: var(--title-color);
            text-shadow: 0 0 10px var(--text-color), 0 0 20px var(--text-color);
            margin: 0;
            text-align: center;
            transition: color 0.3s ease;
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
            background: rgba(128, 128, 128, 0.1);
            border-radius: 1rem;
            transition: background 0.3s ease;
        }

        .lotto-set:hover {
            background: rgba(128, 128, 128, 0.2);
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
            box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 0 12px var(--ball-shadow);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .lotto-ball:hover {
            transform: scale(1.15) rotate(5deg);
            box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 0 20px var(--ball-shadow);
        }

        .generate-button {
            padding: 1.2rem 2.5rem;
            font-size: 1.4rem;
            border-radius: 0.8rem;
            border: none;
            background-image: var(--btn-gradient);
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.2);
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .generate-button:hover {
            background-image: var(--btn-hover-gradient);
            box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.3);
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
    \`;

    this.setsContainer = this.shadowRoot.querySelector('.sets-container');
    this.generateButton = this.shadowRoot.querySelector('.generate-button');

    this.generateButton.addEventListener('click', () => this.generateNumbers());
    this.generateNumbers();
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
    if (number <= 10) return 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)';
    if (number <= 20) return 'linear-gradient(135deg, #2AFADF 0%, #4C83FF 100%)';
    if (number <= 30) return 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)';
    if (number <= 40) return 'linear-gradient(135deg, #C4E538 0%, #42B883 100%)';
    return 'linear-gradient(135deg, #BCC5CE 0%, #929EAD 100%)';
  }

  renderNumbers(allSets) {
    this.setsContainer.innerHTML = '';
    allSets.forEach((set, index) => {
      const setRow = document.createElement('div');
      setRow.classList.add('lotto-set');
      setRow.style.animation = \`fadeIn 0.3s ease forwards \${index * 0.1}s\`;
      setRow.style.opacity = '0';
      
      if (!this.shadowRoot.querySelector('#fadeInStyle')) {
          const style = document.createElement('style');
          style.id = 'fadeInStyle';
          style.textContent = \`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          \`;
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

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);
updateToggleButton(currentTheme);

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateToggleButton(targetTheme);
});

function updateToggleButton(theme) {
    themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}
