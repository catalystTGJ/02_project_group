from django.contrib import admin

from .models import GameUser, GameActive, GameAsset, GameField, GameHistory

class GameUserAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameUser, GameUserAdmin)

class GameActiveAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameActive, GameActiveAdmin)

class GameAssetAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameAsset, GameAssetAdmin)

class GameFieldAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameField, GameFieldAdmin)

class GameHistoryAdmin(admin.ModelAdmin):
    pass
admin.site.register(GameHistory, GameHistoryAdmin)