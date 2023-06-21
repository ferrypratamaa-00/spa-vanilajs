let state = {
    inputValue: localStorage.getItem("inputValue") ?? "",
    hash: location.hash,
};
function setState(newState) {
    const prevState = { ...state };
    const nextState = { ...state, ...newState };
    state = nextState;
    render();
    onChangeState(prevState, nextState);
}

function onChangeState(prevState, nextState) {
    if (prevState.inputValue != nextState.inputValue) {
        localStorage.setItem("inputValue", nextState.inputValue);
    }

    if (prevState.hash !== nextState.hash) {
        history.pushState(null, "", nextState.hash);
    }
}

function link(props) {
    const link = document.createElement("a");
    link.style.marginLeft = "10px";
    link.href = props.href;
    link.textContent = props.label;

    link.onclick = function (event) {
        event.preventDefault();
        const url = new URL(event.target.href);
        setState({ hash: url.hash });
        history.pushState(null, "", event.target.href);
        render();
    };

    return link;
}

function Navbar() {
    const linkHome = link({
        href: "#home",
        label: "Home",
    });

    const linkAbout = link({
        href: "#about",
        label: "About",
    });

    const div = document.createElement("div");
    div.style.paddingBottom = "10px";
    div.append(linkHome);
    div.append(linkAbout);
    return div;
}

function AboutScreen() {
    const linkHome = link({
        href: "#home",
        label: "Kembali ke Home",
        Component: HomeScreen,
    });

    const text = document.createElement("p");
    text.textContent = "Welcome to About";

    const div = document.createElement("div");
    div.append(linkHome);
    div.append(text);

    return div;
}

function HomeScreen() {
    const navbar = Navbar();

    const buttonClear = document.createElement("button");
    buttonClear.textContent = "Clear";

    const textPreview = document.createElement("p");
    textPreview.textContent = state.inputValue;

    const input = document.createElement("input");
    input.id = "input";
    input.value = state.inputValue;
    input.oninput = function (e) {
        setState({ inputValue: e.target.value });
    };
    input.placeholder = "enter your name";

    buttonClear.onclick = function (e) {
        setState({ inputValue: "" });
    };

    const div = document.createElement("div");
    div.append(navbar);
    div.append(input);
    div.append(buttonClear);
    div.append(textPreview);

    return div;
}

function App() {
    const aboutScreen = AboutScreen();
    const homeScreen = HomeScreen();
    if (state.hash === "#about") {
        return aboutScreen;
    } else {
        return homeScreen;
    }
}

function render() {
    const root = document.getElementById("root");
    const app = App();

    const focusedElementId = document.activeElement.id;
    const focusedElementSelectionStart = document.activeElement.selectionStart;
    const focusedElementSelectionEnd = document.activeElement.selectionEnd;

    root.innerHTML = "";
    root.append(app);
    if (focusedElementId) {
        const focusedElement = document.getElementById(focusedElementId);
        focusedElement.focus();
        focusedElement.selectionStart = focusedElementSelectionStart;
        focusedElement.selectionEnd = focusedElementSelectionEnd;
    }
}

render();
