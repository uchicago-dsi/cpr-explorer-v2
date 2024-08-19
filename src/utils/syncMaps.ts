// Portions of the below code
// Copyright (c) 2016, Mapbox

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


function moveToMapPosition(referenceMap: any, mapToMove: any) {
  mapToMove.jumpTo({
    center: referenceMap.getCenter(),
    zoom: referenceMap.getZoom(),
    bearing: referenceMap.getBearing(),
    pitch: referenceMap.getPitch(),
  });
}

// Sync movements of two maps.
//
// All interactions that result in movement end up firing
// a "move" event. The trick here, though, is to
// ensure that movements don't cycle from one map
// to the other and back again, because such a cycle
// - could cause an infinite loop
// - prematurely halts prolonged movements like
//   double-click zooming, box-zooming, and flying
export class MapSyncer {
  mainMap: any = undefined;
  maps: any[] = [];
  subscriptions: any[] = [];

  constructor() {}

  getFns(a: any, b: any) {
    function on() {
      a.on("move", a2b);
      b.on("move", b2a);
    }
    function off() {
      a.off("move", a2b);
      b.off("move", b2a);
    }

    // When one map moves, we turn off the movement listeners
    // on the both maps, move it, then turn the listeners on again
    function a2b() {
      off();
      moveToMapPosition(a, b);
      on();
    }
    function b2a() {
      off();
      moveToMapPosition(b, a);
      on();
    }

    return {
      on,
      off,
    };
  }

  addMap(map: any) {
    if (this.mainMap === undefined) {
      this.mainMap = map;
    } else {
      const { on, off } = this.getFns(this.mainMap, map);
      this.maps.push(map);
      this.subscriptions.push(off);
      on();
    }
  }
  unmount() {
    this.subscriptions.forEach((fn: any) => fn());
  }
}
