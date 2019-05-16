import React from 'react';
import PropTypes from "prop-types";
import {StyledResponsiveXYFrame} from "./common-graph-defs";
import {debounce} from "lodash";
import XYFrame from "semiotic/lib/XYFrame";

class GraphSizeWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      widthMode: 700
    };
    this.ref = React.createRef();
    this.resizeWidth = this.resizeWidth.bind(this);
    this.debouncedWidthListener = debounce(this.resizeWidth, 200);
  }


  componentDidMount() {
    this.resizeWidth();
    if(this.ref.current) {
      window.addEventListener('resize', this.debouncedWidthListener);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedWidthListener);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.width !== this.props.width){
      this.setWidthMode(newProps.width);
    }
  }

  resizeWidth() {
    this.setWidthMode(this.props.width);
  }

  setWidthMode(graphContentWidth) {
    const elementWidth = this.ref.current.offsetWidth;

    const newWidthMode = elementWidth < graphContentWidth ? 'small' : elementWidth;
    if(newWidthMode !== this.state.widthMode) {
      //this.ref.current.scrollRight = 0;
      this.setState({
        widthMode: newWidthMode
      });
    }
  }


  render() {
    const frameProps = {
      ...this.props.frameProps,
      size: [this.state.widthMode === 'small' ? this.props.width : this.state.widthMode, this.props.height]
    };

    return (
      <StyledResponsiveXYFrame ref={this.ref}>
        <XYFrame {...frameProps} />
      </StyledResponsiveXYFrame>
    );
  }
}

GraphSizeWrapper.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  frameProps: PropTypes.object.isRequired
};

GraphSizeWrapper.defaultProps = {
  width: 700,
  height: 320
};

export default GraphSizeWrapper;
