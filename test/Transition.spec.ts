import * as m from 'mithril';
import * as assert from 'assert';
import { Transition, TransitionState } from '../src';

const transitionDuration = 100;

describe('Transition', () => {
  beforeEach(() => m.mount(document.body, null));

  it('handles entering state/callbacks', (done) => {
    let count = 0;
    let transition = null;

    let container = {
      view() {
        transition = m(Transition, {
          isVisible: true,
          onEnter: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.EXITED);
          },
          onEntering: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.ENTERING);
          },
          onEntered: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.ENTERED);
            assert.equal(count, 3);
            done();
          },
          timeout: transitionDuration
        });
        return m('', transition);
      }
    }

    m.mount(document.body, container);
  });

  it('handles exiting state/callbacks', (done) => {
    let count = 0;
    let transition = null;

    let container = {
      isVisible: true,
      view(vnode) {
        transition = m(Transition, {
          isVisible: container.isVisible,
          onEntered: () => {
            if (container.isVisible) {
              container.isVisible = false;
              m.redraw();
            }
          },
          onExit: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.ENTERED);
          },
          onExiting: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.EXITING);
          },
          onExited: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.UNMOUNTED);
            assert.equal(count, 3);
            done();
          },
          timeout: transitionDuration
        });
        return m('', [transition]);
      }
    };

    m.mount(document.body, container);
  });
});
