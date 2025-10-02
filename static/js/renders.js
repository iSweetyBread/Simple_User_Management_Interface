export const renders = {
    table: {
        loginColumn: (var1, var2) =>`
            <div class="input-group input-group-sm flex-column align-items-stretch" style="width: 12rem;">
				<span class="form-control inputUserLoginText text-truncate mb-1" data-id="${var1}" style="max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; width: 100%; min-height: 1.5rem; display: inline-block;">${var2}</span>
			</div>
        `,
        emailColumn: (var1, var2) =>`
            <div class="input-group input-group-sm mb-1" style="width: 18rem;">
				<span class="form-control inputUserEmailText text-truncate" data-id="${var1}" style="white-space: nowrap; text-overflow: ellipsis;">${var2}</span>
				<input type="text" class="form-control inputUserEmail d-none" data-id="${var1}" value="${var2}"/>
				<button class="btn btn-outline-secondary btnEditUserEmail" data-id="${var1}" type="button" title="Edit">
					<i class="bi bi-pencil"></i>
				</button>
				<button class="btn btn-outline-success d-none btnSaveUserEmail" data-id="${var1}" type="button" title="Save">
					<i class="bi bi-check"></i>
				</button>
				<button class="btn btn-outline-danger d-none btnCancelUserEmail" data-id="${var1}" type="button" title="Cancel">
					<i class="bi bi-x"></i>
				</button>
			</div>
			<p class="text-success d-none small emailSuccess" style="margin: 0px" data-id="${var1}"></p>
        `,
        roleColumn: (var1, var2, var3) =>`
            <div class="input-group input-group-sm mb-1" style="width: 13rem;">
				<span class="form-control inputUserRoleText text-truncate" data-id="${var1}" style="white-space: nowrap; text-overflow: ellipsis;">${var2}</span>
				<select class="form-select inputUserRole d-none" data-id="${var1}">
					${var3}
				</select>
				<button class="btn btn-outline-secondary btnEditUserRole" data-id="${var1}" type="button" title="Edit">
					<i class="bi bi-pencil"></i>
				</button>
				<button class="btn btn-outline-success d-none btnSaveUserRole" data-id="${var1}" type="button" title="Save">
					<i class="bi bi-check"></i>
				</button>
				<button class="btn btn-outline-danger d-none btnCancelUserRole" data-id="${var1}" type="button" title="Cancel">
					<i class="bi bi-x"></i>
				</button>
			</div>
			<p class="text-success d-none small roleSuccess" style="margin: 0px" data-id="${var1}"></p>
        `,
        rootColumn: (var1, var2) =>`
            <div class="input-group input-group-sm mb-1" style="width: 8rem;">
				<button class="btn btn-outline-${var2 ? "danger" : "secondary"} btnToggleRoot d-flex align-items-center justify-content-between w-100" data-id="${var1}" type="button">
					<strong><span class="inputUserRootText" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${var2 ? "root" : "non-root"}</span></strong>
					<i class="bi ${var2 ? "bi-shield-fill-check" : "bi-person-fill"} ms-2"></i>
				</button>
			</div>
        `,
        lockColumn: (var1, var2) =>`
            <div class="input-group input-group-sm mb-1" style="width: 8rem;">
				<button class="btn btn-outline-${var2 ? "warning" : "success"} btnToggleLock d-flex align-items-center justify-content-between w-100" data-id="${var1}" type="button">
					<strong><span class="inputUserLockText text-truncate">${var2 ? "locked" : "unlocked"}</span></strong>
					<i class="bi ${var2 ? "bi-lock-fill" : "bi-unlock-fill"} ms-2"></i>
				</button>
			</div>
        `,
        commentColumn: (var1, var2) =>`
            <div class="input-group input-group-sm mb-1" style="width: 100%;">
				<textarea class="form-control inputUserCommentText" data-id="${var1}" style="resize: none; overflow: hidden; white-space: nowrap; height: 28px;" readonly>${var2}</textarea>
				<textarea class="form-control inputUserComment d-none" rows="2" data-id="${var1}" style="resize: none; overflow: auto;">${var2}</textarea>
				<button class="btn btn-outline-info btnExpandComment" data-id="${var1}" type="button" title="Expand/Collapse">
					<i class="bi bi-arrows-expand"></i>
				</button>
				<button class="btn btn-outline-secondary btnEditUserComment" data-id="${var1}" type="button" title="Edit">
					<i class="bi bi-pencil"></i>
				</button>
				<button class="btn btn-outline-success d-none btnSaveUserComment" data-id="${var1}" type="button" title="Save">
					<i class="bi bi-check"></i>
				</button>
				<button class="btn btn-outline-danger d-none btnCancelUserComment" data-id="${var1}" type="button" title="Cancel">
					<i class="bi bi-x"></i>
				</button>
			</div>
			<p class="text-success d-none small commentSuccess" style="margin: 0px" data-id="${var1}"></p>        
        `,
        btnColumn: (var1, var2) =>`
			<button type="button" class="btn btn-sm btn-outline-primary me-1 action-btn btnChangePasswordRoot ${var1}" data-id="${var2}" data-type="pass">Set Passsword</button>
			<button type="button" class="btn btn-sm btn-outline-danger me-1 action-btn btnDeleteUser ${var1}" data-id="${var2}" data-type="remove">Delete</button>
        
        `,
    },
    popover: {
        changeUserPassword: (var1) =>`
            <div style="position: relative; padding: 10px; max-width: 300px;">
				<button type="button" class="btn-close" style="position: absolute; top: 5px; right: 5px;"></button>
				<div style="font-weight: bold; margin-bottom: 10px;">Change Password</div>

				<label for="newPassword${var1}" style="font-weight: 500;">New Password</label>
				<div class="position-relative mb-2">
					<input id="newPassword${var1}" type="password" class="form-control toggle-password-input pe-5" placeholder="New Password">
					<button type="button" class="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2 py-1 px-2 border-0 toggle-password-btn" tabindex="-1">
						<i class="bi bi-eye-slash"></i>
					</button>
				</div>
				<p class="text-danger small mt-1 d-none" id="errorNewPassRoot"></p>

				<label for="repeatPassword${var1}" style="font-weight: 500;">Repeat New Password</label>
				<div class="position-relative mb-3">
					<input id="repeatPassword${var1}" type="password" class="form-control toggle-password-input pe-5" placeholder="Repeat New Password">
					<button type="button" class="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2 py-1 px-2 border-0 toggle-password-btn" tabindex="-1">
						<i class="bi bi-eye-slash"></i>
					</button>
				</div>
				<p class="text-danger small mt-1 d-none" id="errorRepeatPassRoot"></p>

				<div class="d-flex justify-content-end gap-2">
					<button type="button" class="btn btn-sm btn-outline-secondary btnClosePopover" data-id="${var1}">Close</button>
					<button type="button" class="btn btn-sm btn-outline-primary btnConfirmPassword" data-id="${var1}">Confirm</button>
				</div>
				<p class="text-danger small mt-1 d-none" id="errorPassRoot"></p>
				<p class="text-success small mt-1 d-none" id="successPassRoot"></p>
			</div>
        `,
        deleteUser: (var1, var2) =>`
            <div style="position: relative; padding: 10px; max-width: 250px;">
				<button type="button" class="btn-close" style="position: absolute; top: 5px; right: 5px;"></button>
				<div style="font-weight: bold; margin-bottom: 10px;">Delete User</div>

				<p class="text-danger small mt-1 d-none" id="errorDeleteUser"></p>
												
				<div class="d-flex justify-content-end gap-2">
					<button type="button" class="btn btn-sm btn-outline-secondary btnCancelDelete" data-id="${var1}" data-type="${var2}">Cancel</button>
					<button type="button" class="btn btn-sm btn-outline-danger btnConfirmDelete" data-id="${var1}" data-type="${var2}">Delete</button>
				</div>
			</div>
        `,
        error: (var1) => `
            <div class="popover border-0" style="max-width:280px; min-width:200px;">
				<div class="popover-header bg-danger text-white d-flex justify-content-between align-items-center">
					<span>Errors</span>
					<button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
				</div>
				<div class="popover-body p-3">
					<div id="errorList" class="mb-3" style="max-height:150px; overflow-y:auto; font-size:0.9rem;">${var1}</div>
					<div class="d-flex justify-content-end gap-2">
						<button type="button" class="btn btn-sm btn-outline-primary btnCopyErrors">Copy</button>
						<button type="button" class="btn btn-sm btn-outline-secondary btnCloseError">Okay</button>
					</div>
				</div>
			</div>
        `,
    }
}