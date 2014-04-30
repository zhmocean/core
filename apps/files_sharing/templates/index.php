<div id="controls">
	<input type="button" value="<?php p($l->t('Shared with others'))?>">
	<input type="button" value="<?php p($l->t('Shared with me'))?>">
</div>
<table id="filestable" class="shareList" data-allow-public-upload="<?php p($_['publicUploadEnabled'])?>" data-preview-x="36" data-preview-y="36">
	<thead>
		<tr>
			<th class="hidden" id='headerName'>
				<div id="headerName-container">
					<span class="name"><?php p($l->t( 'Name' )); ?></span>
				</div>
			</th>
			<th class="hidden" id="headerSharedWith"><?php p($l->t('Shared with')); ?></th>
			<th class="hidden" id="headerSharedType"><?php p($l->t('Type')); ?></th>
			<th class="hidden" id="headerDate">
				<span id="modified"><?php p($l->t( 'Shared since' )); ?></span>
				<?php if ($_['permissions'] & OCP\PERMISSION_DELETE): ?>
					<span class="selectedActions"><a href="" class="delete-selected">
						<?php p($l->t('Delete'))?>
						<img class="svg" alt="<?php p($l->t('Delete'))?>"
							 src="<?php print_unescaped(OCP\image_path("core", "actions/delete.svg")); ?>" />
					</a></span>
				<?php endif; ?>
			</th>
		</tr>
	</thead>
	<tbody id="fileList">
	</tbody>
	<tfoot>
	</tfoot>
</table>
<input type="hidden" id="dir" value="">
