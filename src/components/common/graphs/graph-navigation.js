import React, { Component } from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components/macro';
import DateTime from "luxon/src/datetime";
import leftArrow from '../../../assets/icons/navigation/left-arrow.svg';
import { throttle } from 'lodash';
import Loading, {StyledLoading} from "../loading";
import * as variables from "../../../assets/styles/variables";

const MAX_LOAD_POS = 150;
const MAX_LOADING_WIDTH = 100;
const ANIMATION_DURATION_MS = 500;


const StyledNavigationLeft = styled.div`

  position: absolute;
  padding: ${props => props.theme.baseSizePartial(0.4)};
  
  background: ${props => props.theme.colors.blueGraphNavigationBackground};
  
  &:hover {
    background: ${props => props.theme.colors.blueGraphNavigationBackground_Hover};
  }
  
  top: 0;
  bottom: 0;
  left: 0; 
  
  z-index: 1;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  opacity: 0;
  transition: opacity 0.3s ease-out;
  
  user-select: none;
  cursor: pointer;
  
  .line {
    width: 2px;
    height: 30px;
    background: ${props => props.theme.colors.blueGraphNavigationLine};
    margin-right: 2px;
    &:last-of-type {
      margin-right: 0;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    display: none;
  }
`;


const StyledGraphNavigation = styled.div`
  height: ${props => props.height}px;
  
  overflow-x: scroll;
  position: relative;

  
  :hover ${StyledNavigationLeft} {
    opacity: 1;
  }
 
`;

const StyledGraphWrapper = styled.div`
  position: relative;
  left: ${props => props.loadPos}px;
  transition: ${props => props.dragging ?  'none' : `left ${ANIMATION_DURATION_MS}ms ease-out`};
`;

const StyledLoadMore = styled.div`
  position: absolute;
  z-index: 0;
  
  cursor: pointer;
  
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background: ${props => props.theme.colors.blueLoadMoreBackground};
  
  &:hover {
    background: ${props => props.theme.colors.blueLoadMoreBackground_Hover};
  } 
  
  ${StyledLoading} {
    width: ${MAX_LOADING_WIDTH}px;
    height: 100%;
    margin: 0;
    
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
      width: 35px;
    }
  }
  
  .content-wrapper {
    height: 100%;
    padding: ${props => props.theme.baseSizePartial(0.5)};
    width: ${MAX_LOAD_POS}px;
    
    position: relative;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .load-before-text {
      width: 100%;
    
      font-weight: ${props => props.theme.fontWeightLight};
      color: ${props => props.theme.colors.lightBlueBrighter};
      text-align: right;
      padding-bottom: ${props => props.theme.baseSizePartial(0.5)};
    }
    
    .date-wrapper {
      width: 100%;
    
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .arrow {
        margin-right: ${props => props.theme.baseSizePartial(0.5)};
      }
      .load-text {
        text-align: right;
        color: white;
        font-weight: ${props => props.theme.fontWeightLight};
        font-size: ${props => props.theme.fontSizeXSmall};
      }
    }
  }
`;

const defaultState = () => ({
  startX: 0,
  loadPos: 0,
  loading: false,
  dragging: false,
});

class GraphNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState();

    this.navRef = React.createRef();
    this.setPosX = this.setPosX.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchStart = this.touchStart.bind(this);

    this.debouncedPosXListener = throttle(this.setPosX, 50, {trailing: false});
  }

  componentDidMount() {
    this.navRef.current.addEventListener('touchstart', this.touchStart
    , {passive: true});

    this.navRef.current.addEventListener('touchmove', this.debouncedPosXListener, {passive: true});

    this.navRef.current.addEventListener('touchend', this.touchEnd, {passive: true});
  }

  componentWillUnmount() {
  }

  touchStart(e) {
    const startX = e.touches[0].pageX;
    this.setState({
      startX
    });
  }

  touchEnd() {
    const shouldLoadNewDay = this.state.loadPos === MAX_LOAD_POS;

    this.setState({
      dragging: false
    });

    if(shouldLoadNewDay) {
      this.loadMore();
    } else {
      this.setState(defaultState());
    }
  }

  setPosX(e) {
    const x = e.touches[0].pageX;
    if (document.scrollingElement.scrollLeft === 0 && x > this.state.startX) {
      const newLoadPos = x-this.state.startX;

      this.setState({
        dragging: true,
        loadPos: newLoadPos > MAX_LOAD_POS ? MAX_LOAD_POS : newLoadPos
      });

    }
  }

  clickGraph() {
    const width = window.innerWidth;

    if(this.state.loadPos > 0) {
      this.setState({
        loadPos: 0
      });
    }

    if(this.state.loading || width > variables.theme.breakpointMobileValue) return;

    this.setState({
      loadPos: 40
    });
    setTimeout(() => {
      this.setState({
        loadPos: 0
      });
    }, 500);
  }

  clickMenu() {
    this.setState({
      loadPos: MAX_LOAD_POS
    })
  }

  loadMore() {
    //Show loading animation and hide text
    this.setState({
      loadPos: MAX_LOADING_WIDTH,
      loading: true
    });

    this.props.loadOlderData().then(() => {
      //Hide loading box when loading is finished
      this.setState({
        loadPos: 0
      });

      //when loading box is off screen -> set to default state (i.e. loading animation hidden, text visible)
      setTimeout(() => {
        this.setState(defaultState());
      }, ANIMATION_DURATION_MS);

    });
  }

  render() {

    return (
        <StyledGraphNavigation
          height={this.props.height}
          ref={this.navRef}
        >
          <StyledLoadMore
            loading={this.state.loading}
            loadPos={this.state.loadPos}
            onClick={() => this.loadMore()}
          >
            { this.state.loading ?
              <Loading/> :
              <div className="content-wrapper">
                <div className="load-before-text">Load before</div>
                <div className="date-wrapper">
                  <img className="arrow" src={leftArrow} alt=""/>
                  <div className="load-text">
                    <div>
                      {DateTime.fromISO(this.props.startTime).toFormat('ccc d.L.yyyy')}
                    </div>
                    <div>
                      {DateTime.fromISO(this.props.startTime).toFormat('h a')}
                    </div>
                  </div>
                </div>
              </div>
            }
          </StyledLoadMore>
          <StyledGraphWrapper
            onClick={() => this.clickGraph()}
            loadPos={this.state.loadPos}
            loading={this.state.loading}
            dragging={this.state.dragging}
          >
            <StyledNavigationLeft
              onClick={() => this.clickMenu()}
              style={this.state.loadPos > 0 ? {opacity: 1}: {}}
            >
              <div className="line"/>
              <div className="line"/>
              <div className="line"/>
            </StyledNavigationLeft>
            {this.props.children}
          </StyledGraphWrapper>
        </StyledGraphNavigation>
    );
  }
}

GraphNavigation.propTypes = {
  height: PropTypes.number,
  startTime: PropTypes.string
};

GraphNavigation.defaultProps = {
  height: 320,
  startTime: null
};

export default GraphNavigation;
