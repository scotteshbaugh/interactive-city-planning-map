function onReady(completed) {
    if (document.readyState === "complete") {
        setTimeout(completed);
    } else {
        document.addEventListener("DOMContentLoaded", completed, false);
    }
}

function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else {
        if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else {
            if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else {
                if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
        }
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
}

function closest(element, selector) {
    var matchesSelector;

    matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;

    while (element) {
        if (element !== document && matchesSelector.bind(element)(selector)) {
            return element;
        } else {
            element = element.parentNode;
        }
    }

    return false;
}

onReady(function() {
    var fullscreen, pointsOfInterest, hotSpots, phase;

    fullscreen = false;

    document.addEventListener("keyup", function(event) {
        if (event.keyCode === 70) {
            if (!fullscreen) {
                launchFullscreen(document.documentElement);

                fullscreen = true;
            } else {
                exitFullscreen();

                fullscreen = false;
            }
        }
    });

    pointsOfInterest = document.querySelectorAll("#points-of-interest .point-of-interest");

    if (pointsOfInterest && pointsOfInterest.length > 0) {
        for (var i = 0; i < pointsOfInterest.length; i++) {
            pointsOfInterest[i].addEventListener("click", function(event) {
                var pointOfInterest, pointOfInterestDescription, left, top;

                event.preventDefault();

                pointOfInterest = this;

                description = document.getElementById("current-point-of-interest-description");

                if (description) {
                    description.parentNode.removeChild(description);
                }

                pointOfInterest.classList.add("active");

                description = document.createElement("div");

                description.setAttribute("id", "current-point-of-interest-description");

                description.innerHTML = document.getElementById(pointOfInterest.getAttribute("data-description")).innerHTML;

                if (pointOfInterest.offsetLeft - 50 > 10) {
                    if (pointOfInterest.offsetLeft - 50 < 1230) {
                        left = pointOfInterest.offsetLeft - 50;
                    } else {
                        left = 1230
                    }
                } else {
                    left = 10;
                }

                if (pointOfInterest.offsetTop - 110 < 10) {
                    top = pointOfInterest.offsetTop + 110;
                } else {
                    top = pointOfInterest.offsetTop - 110;
                }

                description.style.left = left.toString() + "px";

                description.style.top = top.toString() + "px";

                document.getElementById("points-of-interest").appendChild(description);
            });
        }
    }

    hotSpots = document.querySelectorAll("#points-of-interest .point-of-interest.hot");

    if (hotSpots && hotSpots.length > 0) {
        phase = 0;

        window.setInterval(function() {
            if (phase > 3) {
                phase = 0;
            }

            for (var i = 0; i < hotSpots.length; i++) {
                hotSpots[i].style.boxShadow = "0px 0px " + (phase * 15).toString() + "px 0px #000000";
            }

            phase++;
        }, 750);
    }

    document.addEventListener("click", function(event) {
        var pointsOfInterest, description;

        pointsOfInterest = document.querySelectorAll("#points-of-interest .point-of-interest");

        if (pointsOfInterest && pointsOfInterest.length > 0) {
            for (var i = 0; i < pointsOfInterest.length; i++) {
                var closestPointOfInterest;

                closestPointOfInterest = closest(event.toElement, ".point-of-interest");

                if (closestPointOfInterest !== pointsOfInterest[i]) {
                    pointsOfInterest[i].classList.remove("active");

                    if (!pointsOfInterest[i].classList.contains("hot")) {
                        pointsOfInterest[i].style.boxShadow = "";
                    }
                }
            }
        }

        if (!closest(event.toElement, ".point-of-interest")) {
            description = document.getElementById("current-point-of-interest-description");

            if (description) {
                description.parentNode.removeChild(description);
            }
        }
    });
});
