from django.contrib import admin

from .models import GameUser, GameActive, GameAsset, GameHistory

class GameUserAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameUser, GameUserAdmin)

class GameActiveAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameActive, GameActiveAdmin)

class GameAssetAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameAsset, GameAssetAdmin)

class GameHistoryAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameHistory, GameHistoryAdmin)