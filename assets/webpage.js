jQuery(function()
{
    // THEME TOGGLE

	// load saved theme state
    if (localStorage.getItem("theme_toggle") != null)
    {
        setThemeToggle(localStorage.getItem("theme_toggle") == "true");
    }

	// change theme to match current system theme
	if (localStorage.getItem("theme_toggle") == null && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
	{
		setThemeToggle(true);
	}
	if (localStorage.getItem("theme_toggle") == null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
	{
		setThemeToggle(true);
	}

	// set initial toggle state based on body theme class
	if ($("body").hasClass("theme-light"))
	{
		console.log("light");
		setThemeToggle(true);
	}
	else
	{
		console.log("dark");
		setThemeToggle(false);
	}

	function setThemeToggle(state, instant = false)
	{
		$(".toggle__input").each(function()
		{
			$(this).prop("checked", state);
		});

		if(!$(".toggle__input").hasClass("is-checked") && state)
		{
			$(".toggle__input").addClass("is-checked");
			console.log("checked");
		}
		else if ($(".toggle__input").hasClass("is-checked") && !state)
		{
			$(".toggle__input").removeClass("is-checked");
			console.log("unchecked");
		}

		if(!state)
		{
			if ($("body").hasClass("theme-light"))
			{
				$("body").removeClass("theme-light");
			}

			if (!$("body").hasClass("theme-dark"))
			{
				$("body").addClass("theme-dark");
			}
		}
		else
		{
			if ($("body").hasClass("theme-dark"))
			{
				$("body").removeClass("theme-dark");
			}

			if (!$("body").hasClass("theme-light"))
			{
				$("body").addClass("theme-light");
			}
		}

		localStorage.setItem("theme_toggle", state ? "true" : "false");
	}

    $(".toggle__input").on("click", function()
    {
		setThemeToggle(!(localStorage.getItem("theme_toggle") == "true"));
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        let newColorScheme = event.matches ? "theme-dark" : "theme-light";

        if (newColorScheme == "theme-dark")
        {
			setThemeToggle(false);
        }

        if (newColorScheme == "theme-light")
        {
			setThemeToggle(true);
        }
    });

    // MAKE CALLOUTS COLLAPSIBLE
    // if the callout title is clicked, toggle the display of .callout-content
    $(".callout.is-collapsible .callout-title").on("click", function()
    {
        var isCollapsed = $(this).parent().hasClass("is-collapsed");

        if (isCollapsed)
        {
            $(this).parent().toggleClass("is-collapsed");
        }

        $(this).parent().find(".callout-content").slideToggle(duration = 100, complete = function()
        {
            if (!isCollapsed)
            {
                $(this).parent().toggleClass("is-collapsed");
            }
        });
    });

    

    // MAKE HEADERS COLLAPSIBLE
    // if "heading-collapse-indicator" is clicked, toggle the display of every div until the next heading of the same or lower level

    function getHeadingContentsSelector(header)
    {
        let headingLevel = header.parent().prop("tagName").toLowerCase();
        let headingNumber = parseInt(headingLevel.replace("h", ""));

        let endingHeadings = [1, 2, 3, 4, 5, 6].filter(function(item)
        {
            return item <= headingNumber;
        }).map(function(item)
        {
            return `div:has(h${item})`;
        });

        let endingHeadingsSelector = endingHeadings.join(", ");

        return endingHeadingsSelector;
    }


    $(".heading-collapse-indicator").on("click", function()
    {
        var isCollapsed = $(this).parent().parent().hasClass("is-collapsed");
        
        $(this).parent().parent().toggleClass("is-collapsed");

        let selector = getHeadingContentsSelector($(this));

        if(isCollapsed)
        {
            $(this).parent().parent().nextUntil(selector).each(function()
            {
                $(this).show();
            });
            
            $(this).parent().parent().nextUntil(selector).each(function()
            {
                if ($(this).hasClass("is-collapsed"))
                {
                    let s = getHeadingContentsSelector($(this).children().first().children().first());
                    $(this).nextUntil(s).hide();
                }
            });
        }
        else
        {
            $(this).parent().parent().nextUntil(selector).hide();
        }
    });

    // Make button with id="#save-to-pdf" save the current page to a PDF file
    $("#save-pdf").on("click", function()
    {
        window.print();
    });


    // MAKE OUTLINE COLLAPSIBLE
    // if "outline-header" is clicked, toggle the display of every div until the next heading of the same or lower level
    
    var outline_width = 0;

    $(".outline-item-contents > .collapse-icon").on("click", function()
    {
        var isCollapsed = $(this).parent().parent().hasClass("is-collapsed");
        
        $(this).parent().parent().toggleClass("is-collapsed");

        if(isCollapsed)
        {
            $(this).parent().next().slideDown(120);
        }
        else
        {
            $(this).parent().next().slideUp(120);
        }
    });

    // hide the control button if the header has no children
    $(".outline-item-children:not(:has(*))").each(function()
    {
        $(this).parent().find(".collapse-icon").hide();
    });


	// Fix checkboxed toggling .is-checked
	$(".task-list-item-checkbox").on("click", function()
	{
		$(this).parent().toggleClass("is-checked");
		$(this).parent().attr("data-task", $(this).parent().hasClass("is-checked") ? "x" : " ");
	});

	$(`input[type="checkbox"]`).each(function()
	{
		console.log(this);
		console.log($(this).hasClass("is-checked"));

		$(this).prop("checked", $(this).hasClass("is-checked"));
	});

	$('.kanban-plugin__item.is-complete').each(function()
	{
		$(this).find('input[type="checkbox"]').prop("checked", true);
	});

	// make code snippet block copy button copy the code to the clipboard
	$(".copy-code-button").on("click", function()
	{
		let code = $(this).parent().find("code").text();
		navigator.clipboard.writeText(code);
	});

	let focusedNode = null;

	// make canvas nodes selectable
	$(".canvas-node-content-blocker").on("click", function()
	{
		console.log("clicked");
		$(this).parent().parent().toggleClass("is-focused");
		$(this).hide();

		if (focusedNode)
		{
			focusedNode.removeClass("is-focused");
			$(focusedNode).find(".canvas-node-content-blocker").show();
		}

		focusedNode = $(this).parent().parent();
	});

	// make canvas node deselect when clicking outside
	$(document).on("click", function(event)
	{
		if (!$(event.target).closest(".canvas-node").length)
		{
			$(".canvas-node").removeClass("is-focused");
			$(".canvas-node-content-blocker").show();
		}
	});

	// unhide html elements that are hidden by default
	$("html").css("visibility", "visible");

});
