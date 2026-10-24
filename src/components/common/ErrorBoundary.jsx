import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected frontend error."
    };
  }

  componentDidCatch(error) {
    console.error("CivicPilot frontend error:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="not-found">
        <span>!</span>
        <h1>CivicPilot needs to reload</h1>
        <p>{this.state.message}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.handleReload}
        >
          Reload CivicPilot
        </button>
      </div>
    );
  }
}
