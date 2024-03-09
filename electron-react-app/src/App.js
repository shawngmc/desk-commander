import './App.css';
import "@fontsource/rajdhani";
import { Component } from 'react';

function App() {
  return (
    <div className="app-skeleton">
      <header className="app-header">
        <div className="app-header__anchor">
          <span className="app-header__anchor__text">DeskCommander v0.1.0</span>
        </div>
        <nav>
          <ul className="nav">
            {FIXTURES.headerMenu.map((navItem, navItemIndex) => (
              <NavItem key={navItemIndex} navItem={navItem} />
            ))}
          </ul>
        </nav>
        <div />
      </header>
      <div className="app-container">
        <div className="app-main">
          <div className="channel-feed">
            <div className="segment-topbar">
              <div className="segment-topbar__header">
                <TextOverline className="segment-topbar__overline">
                  <Clock />: d869db7fe62fb07c25a0403ecaea55031744b5fb
                </TextOverline>
                <TextHeading4 className="segment-topbar__title">
                  #Shawn
                </TextHeading4>
              </div>
              <div className="segment-topbar__aside">
                <div className="button-toolbar">
                  <a className="button button--default">
                    <IconFeedMute className="button__icon" />
                  </a>
                  <a className="button button--default">
                    <IconFeedSettings className="button__icon" />
                  </a>
                  <a className="button button--default">
                    <IconMenuMore className="button__icon" />
                  </a>
                </div>
              </div>
            </div>
            <div className="channel-feed__body">
              <div className="container">
                <div className="item"></div>
                <div className="item">/dev/kb</div>
                <div className="item">/dev/ptr</div>
                <div className="item">/dev/claw</div>
                <div className="item">/sys/ursamajor</div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">/sys/wingzero</div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">/sys/accent</div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">/sys/flex</div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
                <div className="item">
                  <Toggle size="xl" type="submit" on enabled>
                    //TODO
                  </Toggle>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="app-b">
          <Pad>
            <TextHeading3 $as="h4">CLIMATE</TextHeading3>
            <Toggle size="xl" type="submit" on enabled deviceName={'light'}>
              Light
            </Toggle>
            <Toggle size="xl" type="submit" on enabled deviceName={'fan'}>
              Fan
            </Toggle>
          </Pad>
        </div>  
      </div>
    </div>
  );
}

async function backend(endpoint) {
  await fetch(`http://localhost:5000/${endpoint}`);
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

class Clock extends Component {
  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Lifecycle: Called just before our component will be destroyed
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toISOString();
    return <span>{time}: </span>;
  }
}

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: props.on ? props.on : false
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    if (this.props.enabled) {
      if (this.props.deviceName) {
        try {
          await fetch(`http://localhost:5000/${this.props.deviceName}/toggle`);
          this.setState((prevState) => ({
            isToggleOn: !prevState.isToggleOn
          }));
        } catch (error) {
          console.error(error);
        }
      } else {
        this.setState((prevState) => ({
          isToggleOn: !prevState.isToggleOn
        }));
      }
    }
  }

  render(props, state) {
    var displayType = "on";
    if (!props.enabled) {
      displayType = "disabled";
    } else if (!state.isToggleOn) {
      displayType = "off";
    }
    return (
      <button
        onClick={this.handleClick}
        className={`button-toggle button-toggle--${displayType} ${props.size ? `button-toggle--size-${props.size}` : ""
          }`}
        type="button"
      >
        <span className="button__content">{props.children}</span>
      </button>
    );
  }
}

function Button({
  children,
  type = "button",
  size = "default",
  variant = "default"
}) {
  return (
    <button
      className={`button ${variant ? `button--${variant}` : ""} ${size ? `button--size-${size}` : ""
        }`}
      type={type}
    >
      <span className="button__content">{children}</span>
    </button>
  );
}

function Pad({ children, renderCap = null }) {
  return (
    <div className="pad">
      <div className="pad__body">{children}</div>
    </div>
  );
}

function NavItem({ navItem }) {
  return (
    <li className="nav__item">
      <a
        className={`nav__link ${navItem.isActive
          ? "nav__link--active"
          : navItem.disabled
            ? "nav__link--disabled"
            : ""
          }`}
        href="#"
      >
        <span className="nav__link__element">{navItem.text}</span>
        {navItem.notificationCount > 0 && (
          <span className="nav__link__element">
            <Badge>{navItem.notificationCount}</Badge>
          </span>
        )}
      </a>
    </li>
  );
}

function MakeTextBase(classNameDefault, $asDefault) {
  return ({ $as = null, children, className }) => {
    const AsComponent = $as || $asDefault;

    return (
      <AsComponent className={`${classNameDefault} ${className}`}>
        {children}
      </AsComponent>
    );
  };
}

const TextHeading1 = MakeTextBase("text-heading1", "h1");
const TextHeading2 = MakeTextBase("text-heading2", "h2");
const TextHeading3 = MakeTextBase("text-heading3", "h3");
const TextHeading4 = MakeTextBase("text-heading4", "h4");
const TextHeading5 = MakeTextBase("text-heading5", "h5");
const TextHeading6 = MakeTextBase("text-heading6", "h6");
const TextParagraph1 = MakeTextBase("text-paragraph1", "p");
const TextOverline = MakeTextBase("segment-topbar__overline", "span");

function MakeIcon(svg) {
  return ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {svg}
    </svg>
  );
}

const IconFeedMute = MakeIcon(
  <path d="M18 9.5c2.481 0 4.5 1.571 4.5 3.503 0 1.674-1.703 3.48-4.454 3.48-.899 0-1.454-.156-2.281-.357-.584.358-.679.445-1.339.686.127-.646.101-.924.081-1.56-.583-.697-1.007-1.241-1.007-2.249 0-1.932 2.019-3.503 4.5-3.503zm0-1.5c-3.169 0-6 2.113-6 5.003 0 1.025.37 2.032 1.023 2.812.027.916-.511 2.228-.997 3.184 1.302-.234 3.15-.754 3.989-1.268.709.173 1.388.252 2.03.252 3.542 0 5.954-2.418 5.954-4.98.001-2.906-2.85-5.003-5.999-5.003zm-.668 6.5h-1.719v-.369l.938-1.361v-.008h-.869v-.512h1.618v.396l-.918 1.341v.008h.95v.505zm3.035 0h-2.392v-.505l1.306-1.784v-.011h-1.283v-.7h2.25v.538l-1.203 1.755v.012h1.322v.695zm-10.338 9.5c1.578 0 2.971-1.402 2.971-3h-6c0 1.598 1.45 3 3.029 3zm.918-7.655c-.615-1.001-.947-2.159-.947-3.342 0-3.018 2.197-5.589 5.261-6.571-.472-1.025-1.123-1.905-2.124-2.486-.644-.374-1.041-1.07-1.04-1.82v-.003c0-1.173-.939-2.123-2.097-2.123s-2.097.95-2.097 2.122v.003c.001.751-.396 1.446-1.041 1.82-4.667 2.712-1.985 11.715-6.862 13.306v1.749h9.782c.425-.834.931-1.764 1.165-2.655zm-.947-15.345c.552 0 1 .449 1 1 0 .552-.448 1-1 1s-1-.448-1-1c0-.551.448-1 1-1z" />
);

const IconFeedSettings = MakeIcon(
  <path d="M6 16h-6v-3h6v3zm-2-5v-10h-2v10h2zm-2 7v5h2v-5h-2zm13-7h-6v-3h6v3zm-2-5v-5h-2v5h2zm-2 7v10h2v-10h-2zm13 3h-6v-3h6v3zm-2-5v-10h-2v10h2zm-2 7v5h2v-5h-2z" />
);

const IconMenuMore = MakeIcon(
  <path d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
);

const FIXTURES = {
  headerMenu: [
    { disabled: true, notificationCount: 0, text: "Home" },
    { isActive: true, notificationCount: 0, text: "Control" },
    { disabled: true, notificationCount: 0, text: "Network" },
    { disabled: true, notificationCount: 0, text: "Security" },
    { disabled: true, notificationCount: 0, text: "Hack" }
  ]
};

export default App;
