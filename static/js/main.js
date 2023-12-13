document.addEventListener("DOMContentLoaded", function() {
    function show_hide() {
        var click = document.getElementById("dropdownContent");
        if (click.style.display == "none" || click.style.display === "") {
            click.style.display = "block";
        } else {
            click.style.display = "none";
        }
    }

    // Add event listener to the button
    document.getElementById("sortButton").addEventListener("click", show_hide);
});