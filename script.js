"use strict";

function find_animatable()
{
	const step_map = {}

	// make a map of {step => [elements on that step]}
	for(const el of $(".slide main *[data-anim-step]"))
	{
		const $el = $(el);
		const step = $el.data("anim-step");

		if(typeof step != "number")
			alert("something doesn't have a numeric step");
		else
		{
			if(step_map[step] === undefined)
				step_map[step] = [];

			step_map[step].push($el);
			$el.css('visibility', 'hidden');
		}
	}

	return step_map
}

function get_anim_items()
{
	const step_map = find_animatable();

	// get the list of steps, in proper order
	const order_keys = Object.keys(step_map).map(x => parseInt(x)).sort((a, b) => a - b)

	// normalize the steps so we just have 1, 2, 3, 4...
	const ret = Array(order_keys.length + 1);

	for(let i = 0; i < order_keys.length; i++)
		ret[i + 1] = step_map[order_keys[i]];

	return ret;
}

let anim_items = undefined;
let anim_step = 0;

function anim_set_visibility(step, state)
{
	for(const $v of anim_items[step])
		$v.css('visibility', state);
}

function anim_next()
{
	if(anim_step < anim_items.length - 1)
		anim_set_visibility(++anim_step, 'visible');
}

function anim_prev()
{
	if(anim_step > 0)
		anim_set_visibility(anim_step--, 'hidden');
}

function scale_input()
{
	const scale = parseFloat($(this).val()) / 100;
	$("#scale-out").val(scale);
	$("#slide-view").css("transform", "translate(-50%, -50%) scale(" + scale + ")");
}

function reset_scale()
{
	$("#scale").val(100);
	$("#scale").trigger('input');
}

const DEFAULT_WIDTH = 800.0;

function fullscreen_change()
{
	if(_fullscreenEnabled())
	{
		const scale = screen.width / DEFAULT_WIDTH;
		$("#slide-view").css("transform", "translate(-50%, -50%) scale(" + scale + ")");
	}
	else
		$("#scale").trigger('input');
}

function go_fullscreen()
{
	_requestFullscreen($("#full")[0]);
}

// $("#iconify").click(function()
// {
// 	html2canvas($("#slide-view")[0], {
// 		onrendered: function(canvas)
// 		{
// 			let $canvas = $(canvas);
// 			$canvas.css("max-width", "10em");
// 			$canvas.insertBefore($("#full"));
// 		}
// 	});
// });

$(document).ready(function()
{
	$("#scale").on('input', scale_input);
	$("#scale").trigger('input');
	$("#reset-scale").click(reset_scale);
	$(document).on(_fullscreenchange(), fullscreen_change);
	$("#full-screen").click(go_fullscreen);

	anim_items = get_anim_items();
	$("#anim-next").click(anim_next);
	$("#anim-prev").click(anim_prev);
});