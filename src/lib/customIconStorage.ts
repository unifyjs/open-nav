import { CustomIconData } from "@/components/CustomIconForm";

// 自定义图标的localStorage管理工具
export class CustomIconStorage {
  private static readonly STORAGE_KEY = 'custom_icons';

  // 获取所有自定义图标
  static getAllIcons(): CustomIconData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load custom icons:', error);
      return [];
    }
  }

  // 根据分组ID获取图标
  static getIconsByGroup(groupId: string): CustomIconData[] {
    const allIcons = this.getAllIcons();
    return allIcons.filter(icon => icon.groupId === groupId);
  }

  // 保存新的自定义图标
  static saveIcon(iconData: CustomIconData): void {
    try {
      const existingIcons = this.getAllIcons();
      const updatedIcons = [...existingIcons, iconData];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedIcons));
    } catch (error) {
      console.error('Failed to save custom icon:', error);
      throw new Error('保存自定义图标失败');
    }
  }

  // 更新现有图标
  static updateIcon(iconId: string, updatedData: Partial<CustomIconData>): void {
    try {
      const existingIcons = this.getAllIcons();
      const updatedIcons = existingIcons.map(icon => 
        icon.id === iconId ? { ...icon, ...updatedData } : icon
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedIcons));
    } catch (error) {
      console.error('Failed to update custom icon:', error);
      throw new Error('更新自定义图标失败');
    }
  }

  // 删除图标
  static deleteIcon(iconId: string): void {
    try {
      const existingIcons = this.getAllIcons();
      const updatedIcons = existingIcons.filter(icon => icon.id !== iconId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedIcons));
    } catch (error) {
      console.error('Failed to delete custom icon:', error);
      throw new Error('删除自定义图标失败');
    }
  }

  // 删除分组下的所有图标
  static deleteIconsByGroup(groupId: string): void {
    try {
      const existingIcons = this.getAllIcons();
      const updatedIcons = existingIcons.filter(icon => icon.groupId !== groupId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedIcons));
    } catch (error) {
      console.error('Failed to delete icons by group:', error);
      throw new Error('删除分组图标失败');
    }
  }

  // 更新图标的分组关联
  static updateIconGroup(iconId: string, newGroupId: string): void {
    try {
      this.updateIcon(iconId, { groupId: newGroupId });
    } catch (error) {
      console.error('Failed to update icon group:', error);
      throw new Error('更新图标分组失败');
    }
  }

  // 批量更新图标分组（当分组重命名时）
  static updateIconsGroupName(oldGroupId: string, newGroupId: string): void {
    try {
      const existingIcons = this.getAllIcons();
      const updatedIcons = existingIcons.map(icon => 
        icon.groupId === oldGroupId ? { ...icon, groupId: newGroupId } : icon
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedIcons));
    } catch (error) {
      console.error('Failed to update icons group name:', error);
      throw new Error('更新图标分组名称失败');
    }
  }

  // 清空所有自定义图标
  static clearAllIcons(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear custom icons:', error);
      throw new Error('清空自定义图标失败');
    }
  }

  // 导出自定义图标数据
  static exportIcons(): string {
    try {
      const allIcons = this.getAllIcons();
      return JSON.stringify(allIcons, null, 2);
    } catch (error) {
      console.error('Failed to export custom icons:', error);
      throw new Error('导出自定义图标失败');
    }
  }

  // 导入自定义图标数据
  static importIcons(jsonData: string, replaceExisting: boolean = false): void {
    try {
      const importedIcons: CustomIconData[] = JSON.parse(jsonData);
      
      // 验证数据格式
      if (!Array.isArray(importedIcons)) {
        throw new Error('无效的数据格式');
      }

      if (replaceExisting) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(importedIcons));
      } else {
        const existingIcons = this.getAllIcons();
        const mergedIcons = [...existingIcons, ...importedIcons];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mergedIcons));
      }
    } catch (error) {
      console.error('Failed to import custom icons:', error);
      throw new Error('导入自定义图标失败');
    }
  }
}