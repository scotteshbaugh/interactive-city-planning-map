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

function showDescription(element) {
    var parent, description, left, top, width, height;

    parent = document.getElementById("points-of-interest");

    description = document.getElementById("current-point-of-interest-description");

    if (description) {
        description.parentNode.removeChild(description);
    }

    element.classList.add("active");

    description = document.createElement("div");

    description.setAttribute("id", "current-point-of-interest-description");

    description.innerHTML = document.getElementById(element.getAttribute("data-description")).innerHTML;

    width = parseInt(element.getAttribute("data-description-width"));

    if (!width || width < 200) {
        width = 200;
    }

    description.style.width = width.toString() + "px";

    left = element.offsetLeft + ((element.offsetWidth - width) / 2);

    if (left > parent.offsetWidth - width - 10) {
        left = parent.offsetWidth - width - 10;
    } else {
        if (left < 10) {
            left = 10;
        }
    }

    height = parseInt(element.getAttribute("data-description-height"));

    if (!height || height < 100) {
        height = 100;
    }

    description.style.height = height.toString() + "px";

    top = element.offsetTop - (height + 10);

    if (top < 10) {
        top = element.offsetTop + element.offsetHeight + 10;
    }

    description.style.left = left.toString() + "px";

    description.style.top = top.toString() + "px";

    parent.appendChild(description);

    return description;
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
                event.preventDefault();

                showDescription(this);
            });
        }
    }

    hotSpots = document.querySelectorAll("#points-of-interest .hotspot");

    if (hotSpots && hotSpots.length > 0) {
        phase = 0;

        window.setInterval(function() {
            if (phase > 3) {
                phase = 0;
            }

            for (var i = 0; i < hotSpots.length; i++) {
                hotSpots[i].style.backgroundPosition = "-" + (phase * 360).toString() + "px 0";
            }

            phase++;
        }, 750);

        for (var i = 0; i < hotSpots.length; i++) {
            hotSpots[i].addEventListener("click", function(event) {
                event.preventDefault();

                showDescription(this);
            });
        }
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

        if (!closest(event.toElement, ".point-of-interest") && !closest(event.toElement, ".hotspot")) {
            description = document.getElementById("current-point-of-interest-description");

            if (description) {
                description.parentNode.removeChild(description);
            }
        }
    });
});
