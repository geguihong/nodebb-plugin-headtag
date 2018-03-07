<form role="form" class="headtag-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">General</div>
		<div class="col-sm-10 col-xs-12">
			<p class="lead">
				Adjust these settings. You can then retrieve these settings in code via:
				<code>meta.settings.get('headtag');</code>
			</p>
			<div class="form-group">
				<label for="list">Headtag List</label>
				<textarea class="form-control" name="list" title="Headtag List" placeholder="Headtag List"></textarea>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>